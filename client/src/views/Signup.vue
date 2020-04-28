<template lang="pug">
    div#content
        div.container
            header
                h2 Sign up
            main.signup
                form.signup__manually(@submit.prevent="submit")
                    div.form__group(:class="{'form__group--error': $v.username.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="user")
                            input.form__username(type="text" v-model.trim="$v.username.$model" placeholder="Username" :disabled="status")
                        span.form__note(v-if="!$v.username.required") Field is required
                        span.form__note(v-if="!$v.username.minLength") Username must have at least {{$v.username.$params.minLength.min}} letters
                        span.form__note(v-if="!$v.username.isUnique") This username is already in use
                    div.form__group(:class="{'form__group--error': $v.email.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="envelope")
                            input.form__email(type="text" v-model.trim="$v.email.$model" placeholder="Email" :disabled="status")
                        span.form__note(v-if="!$v.email.required") Field is required
                        span.form__note(v-if="!$v.email.email") Invalid email address
                        span.form__note(v-if="!$v.email.isUnique") This email is already in use
                    div.form__group(:class="{'form__group--error': $v.password.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="key")
                            input.form__password(type="password" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                        span.form__note(v-if="!$v.password.required") Field is required
                        span.form__note(v-if="!$v.password.minLength && $v.password.required") Password must contain at least {{$v.password.$params.minLength.min}} characters
                    div.form__group(:class="{'form__group--error': $v.repeatPassword.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="key")
                            input.form__password(type="password" v-model="$v.repeatPassword.$model" placeholder="Repeat password" :disabled="status")
                        span.form__note(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical
                    input.form__submit(type="submit" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'sign up'}" :disabled="status")
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
                    let res = await axios.get(`https://www.whatawalk.ooguy.com/users/unique/username/${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.alertMsg("Oops, error verifying username. Please try again.");
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
                    let res = await axios.get(`https://www.whatawalk.ooguy.com/users/unique/email/${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.alertMsg("Oops, error verifying email. Please try again.");
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
                        .post("https://www.whatawalk.ooguy.com/users/signup", {
                            username: this.username,
                            email: this.email,
                            password: this.password
                        });
                    this.btnValue = "thank you for signing up";
                    setTimeout(() => {
                        this.$router.push({name: "login"});
                    }, 1000);
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
    @include page-centered-form;

    .signup__manually {
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
