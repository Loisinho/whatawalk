<template lang="pug">
    div#content
        div.container
            header
                h2 Sign up
            div.signup
                form.signup__manually(@submit.prevent="submit")
                    div.signup__group(:class="{'signup__group--error': $v.username.$error}")
                        div.signup__input
                            font-awesome-icon.signup__icon(:icon="user")
                            input.signup__username(type="text" v-model.trim="$v.username.$model" placeholder="Username" :disabled="status")
                        span.signup__note(v-if="!$v.username.required") Field is required
                        span.signup__note(v-if="!$v.username.minLength") Username must have at least {{$v.username.$params.minLength.min}} letters
                        span.signup__note(v-if="!$v.username.isUnique") This username is already in use
                    div.signup__group(:class="{'signup__group--error': $v.email.$error}")
                        div.signup__input
                            font-awesome-icon.signup__icon(:icon="envelope")
                            input.signup__email(type="text" v-model.trim="$v.email.$model" placeholder="Email" :disabled="status")
                        span.signup__note(v-if="!$v.email.required") Field is required
                        span.signup__note(v-if="!$v.email.email") Invalid email address
                        span.signup__note(v-if="!$v.email.isUnique") This email is already in use
                    div.signup__group(:class="{'signup__group--error': $v.password.$error}")
                        div.signup__input
                            font-awesome-icon.signup__icon(:icon="key")
                            input.signup__password(type="password" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                        span.signup__note(v-if="!$v.password.required") Field is required
                        span.signup__note(v-if="!$v.password.minLength") Password must contain at least {{$v.password.$params.minLength.min}} characters
                    div.signup__group(:class="{'signup__group--error': $v.repeatPassword.$error}")
                        div.signup__input
                            font-awesome-icon.signup__icon(:icon="key")
                            input.signup__password(type="password" v-model="$v.repeatPassword.$model" placeholder="Repeat password" :disabled="status")
                        span.signup__note(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical
                    input.signup__submit(type="submit" :value="btnValue" :class="{'signup__submit--error': $v.$anyError, 'signup__submit--success': btnValue !== 'sign up'}" :disabled="status")
        Alert
</template>

<script>
import axios from "axios";
import Alert from "../components/Alert.vue";
import { mapMutations } from "vuex";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import { faUser, faEnvelope, faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "Signup",
    components: {
        Alert
    },
    data: () => {
        return {
            user: faUser,
            envelope: faEnvelope,
            key: faKey,
            eye: faEye,
            eyeSlash: faEyeSlash,
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
            btnValue: "sign up",
            status: false
        }
    },
    validations: {
        username: {
            required,
            minLength: minLength(3),
            async isUnique(value) {
                try {
                    if (value.length < 3) return true;
                    let res = await axios.get(`https://www.whatawalk.ooguy.com/unique/username/${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.alertMsg(error.response.data);
                    this.alertType("error");
                    this.alertActive(true);
                }
            }
        },
        email: {
            required,
            email,
            async isUnique(value) {
                try {
                    if (!this.$v.email.required || !this.$v.email.email) return true;
                    let res = await axios.get(`https://www.whatawalk.ooguy.com/unique/email/${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.alertMsg(error.response.data);
                    this.alertType("error");
                    this.alertActive(true);
                }
            }
        },
        password: {
            required,
            minLength: minLength(6)
        },
        repeatPassword: {
            sameAsPassword: sameAs("password")
        }
    },
    methods: {
        ...mapMutations("alert", [
            "alertMsg",
            "alertType",
            "alertActive"
        ]),
        async submit() {
            try {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.status = true;
                    let res = await axios
                        .post("https://www.whatawalk.ooguy.com/signup", {
                            username: this.username,
                            email: this.email,
                            password: this.password
                        });
                    this.btnValue = "thank you for signing up";
                    // TODO: redirect
                }
            } catch (error) {
                this.alertMsg(error.response.data);
                this.alertType("error");
                this.alertActive(true);
                this.status = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#content {
    width: 100%;
    min-height: calc(100vh - 200px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .container {
        box-shadow: $form-shadow;

        header {
            background: $signup-header-bg;
            padding: 20px;
            text-align: center;
            color: $signup-header-color;

            > h2 {
                text-transform: uppercase;
                font-size: $signup-header-title-size;
            }
        }

        .signup {
            background: $signup-main-color;
            padding: 20px 10%;

            .signup__manually {
                width: 100%;
                display: flex;
                flex-direction: column;

                input {
                    padding: 5px;
                    font-size: $signup-form-input-size;
                    outline: none;
                }

                .signup__group {
                    height: 10vw;
                    margin: 5px 0;

                    .signup__input {
                        display: flex;
                        align-items: center;
                        border-bottom: 2px solid $signup-input-color;

                        .signup__icon {
                            width: $signup-icon-size;
                            height: $signup-icon-size;
                            color: $signup-input-color;
                        }

                        input {
                            width: 100%;
                            background: transparent;
                            border: 0;
                            color: $signup-input-color;

                            &:-ms-input-placeholder {
                                color: $signup-placeholder-color;
                            }

                            &::-webkit-input-placeholder {
                                color: $signup-placeholder-color;
                            }

                            &::placeholder {
                                color: $signup-placeholder-color;
                            }
                        }
                    }

                    .signup__note {
                        display: none;
                        float: right;
                        font-size: $signup-form-note-size;
                        color: $signup-error-color;
                    }

                    &.signup__group--error > .signup__note {
                        display: inline;
                    }

                    &.signup__group--error > input {
                        border-bottom-color: $signup-error-color;
                    }
                }

                .signup__submit {
                    margin: 10px 0;
                    text-transform: uppercase;
                    font-weight: 600;
                    background: $signup-submit-bg;
                    color: $signup-submit-color;
                    border: 4px solid $signup-submit-border;
                    cursor: pointer;
                    transition: all 0.4s;

                    &:hover {
                        background: $signup-submit-border;
                        color: $signup-submit-bg;
                    }

                    &.signup__submit--error {
                        color: $signup-error-color;
                        border-color: $signup-error-color;

                        &:hover {
                            background: $signup-error-color;
                            color: $signup-submit-bg;
                        }
                    }

                    &.signup__submit--success {
                        background: $signup-success-color;
                        color: $signup-submit-bg;
                        border-color: $signup-success-color;
                        cursor: auto;
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    #content {
        width: 480px;

        .container {
            header > h2 {
                font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-header-title-size);
            }

            .signup .signup__manually {
                input {
                    font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-form-input-size);
                }

                .signup__group {
                    height: 60px;
                    
                    .signup__input .signup__icon {
                        width: font-size-vw(map-get($conatiner-widths, "sd"), $signup-icon-size);
                        height: font-size-vw(map-get($conatiner-widths, "sd"), $signup-icon-size);
                    }

                    .signup__note {
                        font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-form-note-size);
                    }
                }
            }
        }
    }
}
</style>
