<template lang="pug">
    label.image__upload(for="image__file")
        input#image__file(type="file" aria-label="Upload image" @change="previewImage")
        font-awesome-icon(:icon="faArrowAltCircleUp")
</template>

<script>
import { faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "ImageUpload",
    data: () => {
        return {
            faArrowAltCircleUp
        }
    },
    methods: {
        previewImage() {
            let input = document.getElementById("image__file");
            if (input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    document.querySelector(".main__img > img").src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.image__upload {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    > input[type="file"] {
        width: 0;
        height: 0;
        display: block;
        overflow: hidden;

        + svg {
            font-size: $profile-upload-size;
            display: block;
            color: $profile-upload-color;
            cursor: pointer;
            transition: all 0.4s;
            
            &:hover {
                color: darken($profile-upload-color, 20%);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .image__upload > input[type="file"] + svg {
        font-size: vw-to-px(map-get($container-widths, "sd"), $profile-upload-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .image__upload > input[type="file"] + svg {
        font-size: vw-to-px(map-get($container-widths, "md"), $profile-upload-size);
    }
}
</style>
