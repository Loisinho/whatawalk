<template lang="pug">
    div
        div.content
            div.container
                header
                    h2 Forgot password?
                main.forgot
                    form.forgot__form(@submit.prevent="submit")
                        div.form__group(:class="{'form__group--error': $v.email.$error}")
                            div.form__inputbox
                                font-awesome-icon.form__icon(:icon="faEnvelope")
                                input.form__email(type="text" aria-label="Email" v-model.trim="$v.email.$model" placeholder="Email" :disabled="status" aria-required="true")
                            span.form__note(v-if="!$v.email.required") Field is required
                        p.forgot__info A message will be sent to this email address.
                        input.form__submit(type="submit" aria-label="Send" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'send email'}" :disabled="status")
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "Forgot",
    data: () => {
        return {
            faEnvelope,
            email: null,
            btnValue: "send email",
            status: false
        }
    },
    validations: {
        email: {
            required
        }
    },
    methods: {
        async submit() {
            try {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.status = true;
                    await this.$http.post("users/recovery", {email: this.email});
                    this.btnValue = "check your mailbox";
                }
            } catch (error) {
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
                this.status = false;
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

        .forgot__info {
            text-align: center;
            color: $nav-links-bg;
        }

        .form__submit {
            @include form-submit;
        }
    }
}
</style>
