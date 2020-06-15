<template lang="pug">
    div
        div.content
            div.container
                header
                    h2 Reset password
                main.forgot
                    form.forgot__form(@submit.prevent="submit")
                        div.form__group(:class="{'form__group--error': $v.password.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faKey")
                                input.form__password(v-if="!peek" type="password" aria-label="New password" v-model="$v.password.$model" placeholder="Password" maxlength="120" :disabled="status" aria-required="true")
                                input.form__password(v-else type="text" aria-label="New password" v-model="$v.password.$model" placeholder="Password" maxlength="120" :disabled="status")
                                font-awesome-icon.form__icon.form__eye(v-if="!peek" :icon="faEye" @click="peek = !peek")
                                font-awesome-icon.form__icon.form__eye(v-else :icon="faEyeSlash" @click="peek = !peek")
                            span.form__note(v-if="!$v.password.required") Field is required
                            span.form__note(v-if="!$v.password.minLength && $v.password.required") Password must contain at least {{$v.password.$params.minLength.min}} characters
                            span.form__note(v-if="!$v.password.maxLength && $v.password.required") Password must contain at most {{$v.password.$params.maxLength.max}} characters
                        div.form__group(:class="{'form__group--error': $v.repeatPassword.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faKey")
                                input.form__password(type="password" aria-label="Repeat new password" v-model="$v.repeatPassword.$model" placeholder="Repeat password" :disabled="status" aria-required="true")
                            span.form__note(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical
                        input.form__submit(type="submit" aria-label="Save" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'save'}" :disabled="status")
</template>

<script>
import { required, minLength, maxLength, sameAs } from "vuelidate/lib/validators";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "ResetPassword",
    props: {
        email: {
            type: String
        },
        token: {
            type: String
        }
    },
    data: () => {
        return {
            faKey,
            faEye,
            faEyeSlash,
            password: null,
            repeatPassword: null,
            btnValue: "save",
            peek: false,
            status: false
        }
    },
    validations: {
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
                    await this.$http.post("users/reset", {email: this.email, token: this.token, password: this.password});
                    this.btnValue = "New password saved!";
                    setTimeout(() => {
                        this.$router.push({name: "login"});
                    }, 1000);
                }
            } catch (error) {
                this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
    @include page-centered-form;

    .forgot__form {
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
