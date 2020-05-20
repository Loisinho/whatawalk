<template lang="pug">
    div
        div.content
            div.container
                header
                    h2 Sign up
                main.signup
                    form.signup__manually(@submit.prevent="submit")
                        div.form__group(:class="{'form__group--error': $v.email.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faEnvelope")
                                input.form__email(type="text" v-model.trim="$v.email.$model" placeholder="Email" maxlength="254" :disabled="status")
                            span.form__note(v-if="!$v.email.required") Field is required
                            span.form__note(v-if="!$v.email.email || !$v.email.maxLength") Invalid email address
                            span.form__note(v-if="!$v.email.isUnique") This email is already in use
                        div.form__group(:class="{'form__group--error': $v.username.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faUser")
                                input.form__username(type="text" v-model.trim="$v.username.$model" placeholder="Username" maxlength="25" :disabled="status")
                            span.form__note(v-if="!$v.username.required") Field is required
                            span.form__note(v-if="!$v.username.minLength") Username must have at least {{$v.username.$params.minLength.min}} letters
                            span.form__note(v-if="!$v.username.maxLength") Username must have at most {{$v.username.$params.maxLength.max}} letters
                            span.form__note(v-if="!$v.username.isUnique") This username is already in use
                        div.form__group(:class="{'form__group--error': $v.password.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faKey")
                                input.form__password(v-if="!peek" type="password" v-model="$v.password.$model" placeholder="Password" maxlength="120" :disabled="status")
                                input.form__password(v-else type="text" v-model="$v.password.$model" placeholder="Password" maxlength="120" :disabled="status")
                                font-awesome-icon.form__icon.form__eye(v-if="!peek" :icon="faEye" @click="peek = !peek")
                                font-awesome-icon.form__icon.form__eye(v-else :icon="faEyeSlash" @click="peek = !peek")
                            span.form__note(v-if="!$v.password.required") Field is required
                            span.form__note(v-if="!$v.password.minLength && $v.password.required") Password must contain at least {{$v.password.$params.minLength.min}} characters
                            span.form__note(v-if="!$v.password.maxLength && $v.password.required") Password must contain at most {{$v.password.$params.maxLength.max}} characters
                        div.form__group(:class="{'form__group--error': $v.repeatPassword.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faKey")
                                input.form__password(type="password" v-model="$v.repeatPassword.$model" placeholder="Repeat password" :disabled="status")
                            span.form__note(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical
                        input.form__submit(type="submit" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'sign up'}" :disabled="status")
</template>

<script>
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { faUser, faEnvelope, faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "Signup",
    data: () => {
        return {
            faUser,
            faEnvelope,
            faKey,
            faEye,
            faEyeSlash,
            email: null,
            username: "",
            password: null,
            repeatPassword: null,
            btnValue: "sign up",
            peek: false,
            status: false
        }
    },
    validations: {
        email: {
            required,
            email,
            maxLength: maxLength(254),
            async isUnique(value) {
                try {
                    if (!this.$v.email.required || !this.$v.email.email) return true;
                    let res = await this.$http.get(`users/exists?email=${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.$store.state.alert.msg = "Oops, error verifying email. Please try again.";
                    this.$store.state.alert.type = "error";
                    this.$store.commit("alert/alertActive");
                }
            }
        },
        username: {
            required,
            minLength: minLength(3),
            maxLength: maxLength(25),
            async isUnique(value) {
                try {
                    if (value.length < 3) return true;
                    let res = await this.$http.get(`users/exists?username=${value}`);
                    return Boolean(res.data);
                } catch (error) {
                    this.$store.state.alert.msg = "Oops, error verifying username. Please try again.";
                    this.$store.state.alert.type = "error";
                    this.$store.commit("alert/alertActive");
                }
            }
        },
        password: {
            required,
            minLength: minLength(6),
            maxLength: maxLength(120)
        },
        repeatPassword: {
            sameAsPassword: sameAs("password")
        }
    },
    methods: {
        async submit() {
            try {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.status = true;
                    let res = await this.$http
                        .post("users/signup", {
                            email: this.email,
                            username: this.username,
                            password: this.password
                        });
                    this.btnValue = "thank you for signing up";
                    setTimeout(() => {
                        this.$router.push({name: "login"});
                    }, 1000);
                }
            } catch (error) {
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
                this.status = false;
            }
        }
    }, 
    created: function () {
        this.email = this.$route.params.email? this.$route.params.email : null;
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
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
