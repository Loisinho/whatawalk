<template lang="pug">
    div
        div.content
            div.travel
                div#mapid
                div.travel__list(v-if="list.length")
                    div.travel__item(v-bind:key="item.id" v-for="(item, i) in list")
                        span {{ item.tag }}
                        span {{ item.name }}
                        font-awesome-icon(:icon="faTimes" @click="list.splice(i, 1)")
                    Selector(@select-group="save" v-bind:title="'Save in'")
                form.travel__search(@submit.prevent="submitMethod")
                    input.travel__location(type="text" v-model.trim="location.name" placeholder="Location.." :disabled="status")
                    div.travel__tags(v-if="location.id" @click="tagsOpen = !tagsOpen")
                        span.custom__select(:class="{'custom__select--none': !tag}") {{ tag? tag : "select a tag.." }}
                        font-awesome-icon(:icon="faSortDown")
                        div.custom__options(:class="{'custom__options--active': tagsOpen}")
                            p(@click="tag = 'hotels'") hotels
                            p(@click="tag = 'eatingout'") eatingout
                            p(@click="tag = 'do'") do
                            p(@click="tag = 'sightseeing'") sightseeing
                            p(@click="tag = 'tours'") tours
                            p(@click="tag = 'character'") character
                            p(@click="tag = 'nightlife'") nightlife
                            p(@click="tag = 'practicalities'") practicalities
                    div.travel__buttons
                        button.travel__btn(type="submit" :disabled="location.name === '' || !tag")
                            font-awesome-icon(:icon="faSearch")
                        button.travel__btn(type="reset" @click="reset")
                            font-awesome-icon(:icon="faTrashAlt")
                div.travel__results(v-if="location.id && !auxTag")
                    h1.travel__title {{ location.name }}
                    div.travel__content(v-for="section in location.content.sections")
                        p.travel__text(v-html="section.body")
                        img.travel__img(v-if="section.image" :src="section.image.sizes.medium.url" alt="Error loading image")
                div.travel__pois(v-else-if="pois.length")
                    div.travel__poi(v-for="poi in pois")
                        img(v-if="poi.images.length" :src="poi.images[0].sizes.medium.url" alt="Error loading image")
                        div
                            h3 {{ poi.name }}
                            p {{ poi.intro }}
                            button.travel__btn(type="button" @click="add(poi)") Add
                    button.travel__btn.trave__more(v-if="more" @click="submitMethod") More
</template>

<script>
import { faSearch, faTrashAlt, faSortDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import Selector from "../components/Selector.vue";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
    name: "Map",
    components: {
        Selector
    },
    data: () => {
        return {
            faSearch,
            faTrashAlt,
            faSortDown,
            faTimes,
            map: null,
            marker: null,
            auxMarker: {},
            list: [],
            location: {
                name: ""
            },
            tagsOpen: false,
            tag: true,
            auxTag: null,
            offset: 0,
            pois: [],
            poisMarkers: [],
            more: true,
            status: false
        }
    },
    methods: {
        mapInit() {
            this.map = L.map('mapid').setView([40, 34], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
                maxZoom: 18,
                minZoom: 2
            }).addTo(this.map);
            this.map.on('click', this.createMarker);
        },
        async searchLocation() {
            try {
                this.tag = false;
                this.status = true;
                let res = await this.$http.get(`travels/location?id=${this.location.name}`);
                this.location = res.data.results[0];
                this.marker = L.marker([this.location.coordinates.latitude, this.location.coordinates.longitude])
                    .addTo(this.map)
                    .bindPopup(this.location.name);
                this.auxMarker = {lat: this.marker.getLatLng().lat, lng: this.marker.getLatLng().lng};
                this.map.setView([this.location.coordinates.latitude, this.location.coordinates.longitude], 12);
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        async searchPoi() {
            try {
                let lat = this.marker.getLatLng().lat;
                let lng = this.marker.getLatLng().lng;
                if (this.tag !== this.auxTag || this.auxMarker.lat !== lat || this.auxMarker.lng !== lng) {
                    this.pois = [];
                    this.poisMarkers.map(i => this.map.removeLayer(i));
                    this.poisMarkers = [];
                    this.more = true;
                    this.auxTag = this.tag;
                    this.auxMarker = {lat: this.marker.getLatLng().lat, lng: this.marker.getLatLng().lng};
                }
                if (this.more) {
                    let res = {};
                    if (this.location.coordinates.latitude === lat && this.location.coordinates.longitude === lng)
                        res = await this.$http.get(`travels/poiInlocation?id=${this.location.id}&tag=${this.tag}&offset=${this.offset}`);
                    else
                        res = await this.$http.get(`travels/poiInCoordinates?lat=${lat}&lng=${lng}&tag=${this.tag}&offset=${this.offset}`);
                    this.pois = this.pois.concat(res.data.results);
                    this.offset += res.data.results.length;
                    if (!res.data.more) {
                        this.more = false;
                        if (!this.offset) {
                            this.$store.commit("alert/activateAlert", {
                                msg: "There are no " + this.tag,
                                type: "error"
                            });
                        }
                    }
                    res.data.results.map(i => {
                        this.poisMarkers.push(new L.marker([i.coordinates.latitude, i.coordinates.longitude]).addTo(this.map).bindPopup(i.name));
                    });
                }
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        createMarker(e) {
            if (this.marker) this.map.removeLayer(this.marker);
            this.marker = new L.marker(e.latlng).addTo(this.map);
        },
        submitMethod() {
            this.tag === true? this.searchLocation() : this.searchPoi();
        },
        reset() {
            if (this.marker) {
                this.map.removeLayer(this.marker);
                this.marker = null;
                this.auxMarker = {};
                this.poisMarkers.map(i => this.map.removeLayer(i));
                this.poisMarkers = [];
            }
            this.location = {name: ''};
            this.tag = true;
            this.auxTag = null;
            this.pois = [];
            this.list = [];
            this.status = false;
        },
        add(poi) {
            let item = {
                id: poi.id,
                name: poi.name,
                tag: this.tag,
                coords: {
                    lat: poi.coordinates.latitude,
                    lng: poi.coordinates.longitude
                }
            };
            if (!this.list.map(i => i.id).includes(poi.id)) this.list.push(item);
        },
        async save(group) {
            try {
                let res = await this.$http.post('groups/travel', {
                    group: group,
                    location: this.location.id,
                    list: this.list
                });
                this.$store.commit("alert/activateAlert", {
                    msg: "Travel saved successfully!",
                    type: "success"
                });
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        }
    },
    mounted: function() {
        this.mapInit();
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
    margin-bottom: 45px;

    .travel {
        background: $profile-bg;

        #mapid {
            height: 250px;
            border: 4px solid #ffffff;
            z-index: 0;
        }

        .travel__list {
            padding: 25px 25px 0;

            .travel__item {
                @include container-flex("v");
                padding: 0 10px;
                min-height: 40px;
                font-size: 18px;
                background: $nav-links-bg;
                cursor: default;

                span {
                    &:first-child {
                        margin-right: 10px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                }
                
                svg {
                    margin-left: auto;
                    color: $alert-error-bg;
                    cursor: pointer;
                }

                &:hover {
                    transform: scaleY(0.92);
                }
            }

            #selector {
                width: 100%;
            }
        }

        .travel__search {
            padding: 25px;

            .travel__location {
                width: 100%;
                height: 40px;
                padding: 0 5px;
                border: 4px solid $nav-links-bg;
                font-size: 18px;
                font-weight: bold;
                background: transparent;
                color: $nav-links-color;
            }

            .travel__tags {
                @include custom-select();
                font-size: 18px;
                background: $nav-links-bg;

                .custom__select {
                    padding: 0 7px;
                }

                .custom__options {
                    background: rgba(#000000, 0.7);
                }
            }

            .travel__buttons {
                @include container-flex();
            }
        }

        .travel__results {
            padding: 0 25px 25px;

            .travel__title {
                margin-bottom: 20px;
            }

            .travel__content {
                margin-bottom: 20px;

                .travel__text {
                    text-align: justify;
                    margin-bottom: 10px;
                }

                .travel__img {
                    width: 100%;
                }
            }
        }

        .travel__pois {
            padding: 0 25px 25px;

            .travel__poi {
                @include container-flex($direction: column);
                padding: 10px;
                margin-bottom: 20px;
                background: $nav-links-color;
                color: $nav-links-bg;

                > div > h3 {
                    margin-bottom: 5px;
                }

                > div > p {
                    text-align: justify;
                    margin-bottom: 5px;
                }
            }
        }

        .travel__btn {
            width: 100%;
            height: 40px;
            text-align: center;
            font-size: 18px;
            background: $nav-links-bg;
            color: $nav-links-color;
            transition: all $transition-time;

            &.travel__more {
                width: auto;
                margin-left: 50%;
                transform: translate(-50%);
            }

            &:hover {
                background: $nav-links-color;
                color: $nav-links-bg;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content .travel #mapid { height: 300px; }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .content .travel #mapid { height: 350px; }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .content .travel {
        #mapid {
            height: 400px;
        }

        .travel__pois {
            .travel__poi {
                @include container-flex();
                overflow: auto;

                img {
                    width: 40%;
                    float: left;
                }

                > div {
                    @include container-flex($direction: column);
                    width: 100%;
                    float: left;
                    padding-left: 10px;

                    > button {
                        margin-top: auto;
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    .content .travel #mapid { height: 500px; }
}
</style>
