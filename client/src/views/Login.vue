<template lang="pug">
    div#content
        div.container
            header
                h2 Log in
            main.login
                form.login__manually(@submit.prevent="submit")
                    div.form__group(:class="{'form__group--error': $v.user.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="faUser")
                            input.form__user(type="text" v-model.trim="$v.user.$model" placeholder="Username or email" :disabled="status")
                        span.form__note(v-if="!$v.user.required") Field is required
                    div.form__group(:class="{'form__group--error': $v.password.$error}")
                        div.form__inputbox
                            font-awesome-icon.form__icon(:icon="lock")
                            input.form__password(type="password" v-model="$v.password.$model" placeholder="Password" :disabled="status")
                        span.form__note(v-if="!$v.password.required") Field is required
                    input.form__submit(type="submit" :value="btnValue" :class="{'form__submit--error': $v.$anyError, 'form__submit--success': btnValue !== 'log in'}" :disabled="status")
        Alert
</template>

<script>
import axios from "axios";
import Alert from "../components/Alert.vue";
import { mapMutations } from "vuex";
import { required } from "vuelidate/lib/validators";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default {
    name: "Login",
    components: {
        Alert
    },
    data: () => {
        return {
            faUser: faUser,
            lock: faLock,
            eye: faEye,
            eyeSlash: faEyeSlash,
            user: "",
            password: "",
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
                        .post("https://www.whatawalk.ooguy.com/login", {
                            user: this.user,
                            password: this.password
                        });
                    this.btnValue = "thank you for logging in";
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
    @include page-centered-form;

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
