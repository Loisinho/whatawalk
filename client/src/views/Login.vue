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
                                input.form__password(type="password" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                            span.form__note(v-if="!$v.password.required") Field is required
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
                    await this.$http
                        .post("users/login", {
                            user: this.user,
                            password: this.password
                        });
                    this.btnValue = "thank you for logging in";
                    setTimeout(() => {
                        this.$router.push({name: "home"});
                    }, 1000);
                }
            } catch (error) {
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
                this.status = false;
            }
        },
        googleOAuth() {
            this.auth2.grantOfflineAccess().then(async () => {
                let profile = this.auth2.currentUser.get().getBasicProfile();
                let id_token = this.auth2.currentUser.get().getAuthResponse().id_token;
                try {
                    let res = await this.$http
                        .post("users/google", {
                            idtoken: id_token
                        });
                    if (res.data) {
                        this.btnValue = "thank you for logging in";
                        setTimeout(() => {
                            this.$router.push({name: "explore"});
                        }, 1000);
                    } else {
                        this.$router.push({name: "signup", params: { email: profile.getEmail() }});
                    }
                } catch (error) {
                    this.$store.state.alert.msg = error.response.data;
                    this.$store.state.alert.type = "error";
                    this.$store.commit("alert/alertActive");
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

        .form__submit {
            @include form-submit;
        }
    }
}
</style>
