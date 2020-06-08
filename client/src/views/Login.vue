<template lang="pug">
    div
        div.content
            div.container
                header
                    h2 Log in
                main.login
                    div.login__google
                        button.g-signin2(type="button" @click="googleOAuth")
                            img.icon(src="../assets/google_btn.svg" alt="Google Authentication")
                            span.text Sign in with Google
                        p or
                    form.login__manually(@submit.prevent="submit")
                        div.form__group(:class="{'form__group--error': $v.user.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faUser")
                                input.form__user(type="text" v-model.trim="$v.user.$model" placeholder="Username or email" :disabled="status")
                            span.form__note(v-if="!$v.user.required") Field is required
                        div.form__group(:class="{'form__group--error': $v.password.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faLock")
                                input.form__password(v-if="!peek" type="password" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                                input.form__password(v-else type="text" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                                font-awesome-icon.form__icon.form__eye(v-if="!peek" :icon="faEye" @click="peek = !peek")
                                font-awesome-icon.form__icon.form__eye(v-else :icon="faEyeSlash" @click="peek = !peek")
                            span.form__note(v-if="!$v.password.required") Field is required
                        router-link(to="/forgot") Forgot password?
                        router-link(to="/signup" style="margin-bottom: 15px;") Create new account
                        input.form__submit(type="submit" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'log in'}" :disabled="status")
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "Login",
    data: () => {
        return {
            faUser,
            faLock,
            faEye,
            faEyeSlash,
            user: null,
            password: null,
            btnValue: "log in",
            peek: false,
            status: false
        }
    },
    validations: {
        user: {
            required
        },
        password: {
            required
        }
    },
    methods: {
        async submit() {
            try {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.status = true;
                    let user = await this.$http
                        .post("users/login", {
                            user: this.user,
                            password: this.password
                        });
                    this.btnValue = "thank you for logging in";
                    this.$store.commit("session/checkSession", {
                        isLoggedIn: !!user.data,
                        username: user.data.username,
                        img: user.data.img,
                        notices: user.data.notices
                    });
                    setTimeout(() => {
                        this.$router.push({name: "home"});
                    }, 1000);
                }
            } catch (error) {
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
                this.status = false;
            }
        },
        googleOAuth() {
            this.auth2.grantOfflineAccess().then(async () => {
                let profile = this.auth2.currentUser.get().getBasicProfile();
                let id_token = this.auth2.currentUser.get().getAuthResponse().id_token;
                try {
                    let user = await this.$http
                        .post("users/google", {
                            idtoken: id_token
                        });
                    if (user.data) {
                        this.btnValue = "thank you for logging in";
                        this.$store.commit("session/checkSession", {
                            isLoggedIn: !!user.data,
                            username: user.data.username,
                            img: user.data.img,
                            notices: user.data.notices
                        });
                        setTimeout(() => {
                            this.$router.push({name: "home"});
                        }, 1000);
                    } else {
                        this.$router.push({name: "signup", params: { email: profile.getEmail() }});
                    }
                } catch (error) {
                    this.$store.commit("alert/activateAlert", {
                        msg: error.response.data,
                        type: "error"
                    });
                    this.status = false;
                }
            });
        }
    },
    created: function() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '71894072240-kghnul51csm9n5e491rrj4fecrdr91oi.apps.googleusercontent.com',
                scope: 'profile'
            });
        });
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
    @include page-centered-form;

    .g-signin2 {
        @include container-flex(v);
		width: 100%;
		font-size: $google-btn-size;
		font-weight: bold;
		background: #ffffff;
		color: rgba(#000000, 0.54);

        .icon {
        	width: 11.25%;
            margin-right: 15%;
        }

        ~ p {
            padding: 10px;
    		font-size: $google-btn-size;
            text-align: center;
            color: #000000;
        }
    }
    
    @media only screen and (min-width: map-get($breakpoints, "sd")) {
        .g-signin2 {
            font-size: vw-to-px(map-get($container-widths, "sd"), $google-btn-size);

            ~ p {
                font-size: vw-to-px(map-get($container-widths, "sd"), $google-btn-size);
            }
        }
    }

    .login__manually {
        @include main-form;

        .form__group {
            @include form-group;
        }

        > a {
            padding: 5px;
            text-align: center;
            color: $form-submit-color;

            &:hover {
                color: rgba($form-submit-color, 0.5);
            }
        }

        .form__submit {
            @include form-submit;
        }
    }
}
</style>
