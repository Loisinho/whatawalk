<template lang="pug">
    div#content
        div.container
            header
                h2 Sign up
            div.signup
                form.signup__manually(@submit.prevent="submit")
                    div.signup__group(:class="{'signup__group--error': $v.username.$error}")
                        input.signup__username(type="text" v-model.trim="$v.username.$model" placeholder="Username")
                        span.signup__note(v-if="!$v.username.required") Field is required
                        span.signup__note(v-if="!$v.username.minLength") Username must have at least {{$v.username.$params.minLength.min}} letters
                        span.signup__note(v-if="!$v.username.isUnique") This username is already in use
                    div.signup__group(:class="{'signup__group--error': $v.email.$error}")
                        input.signup__email(type="text" v-model.trim="$v.email.$model" placeholder="Email")
                        span.signup__note(v-if="!$v.email.required") Field is required
                        span.signup__note(v-if="!$v.email.email") Invalid email address
                    div.signup__group(:class="{'signup__group--error': $v.password.$error}")
                        input.signup__password(type="password" v-model="$v.password.$model" placeholder="Password")
                        span.signup__note(v-if="!$v.password.required") Field is required
                        span.signup__note(v-if="!$v.password.minLength") Password must contain at least {{$v.password.$params.minLength.min}} characters
                    div.signup__group(:class="{'signup__group--error': $v.repeatPassword.$error}")
                        input.signup__password(type="password" v-model="$v.repeatPassword.$model" placeholder="Repeat password")
                        span.signup__note(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical
                    input.signup__submit(type="submit" value="Sign up" :class="{'signup__submit--error': $v.$anyError}" :disabled="status")
</template>

<script>
import axios from "axios";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";

export default {
    name: "Signup",
    data: () => {
        return {
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
            status: false
        }
    },
    validations: {
        username: {
            required,
            minLength: minLength(3),
            isUnique(value) {
                if (value.length < 3) return true;
                // simulate async call, fail for all logins with even length
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(typeof value === "string" && value.length % 2 !== 0);
                    }, 350 + Math.random() * 300)
                });
            },
            // async isUnique(value) {
            //     let res = await fetch(`/api/unique/${value}`);
            //     return Boolean(await res.json());
            // }
        },
        email: {
            required,
            email
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
        async submit() {
            console.log("Submit!");
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.status = true;
                let res = await axios
                    .post("https://www.whatawalk.ooguy.com/signup", {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    });
                console.log(res);
                this.status = false;
            } else {
                console.log("Invalid!");
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
        box-shadow: 10px 10px 20px rgba(#000, 0.4);

        header {
            background: $signup-header-bg;
            padding: 20px;
            text-align: center;
            color: $signup-header-color;

            > h2 {
                text-transform: uppercase;
                font-size: $signup-header-title;
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
                    font-size: $signup-form-input;
                    outline: none;
                }

                .signup__group {
                    height: 10vw;
                    margin: 5px 0;

                    > input {
                        width: 100%;
                        background: transparent;
                        border: 0;
                        border-bottom: 2px solid $signup-input-color;
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

                    .signup__note {
                        display: none;
                        float: right;
                        font-size: $signup-form-note;
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
                font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-header-title);
            }

            .signup .signup__manually {
                input {
                    font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-form-input);
                }

                .signup__group {
                    height: 60px;

                    .signup__note {
                        font-size: font-size-vw(map-get($conatiner-widths, "sd"), $signup-form-note);
                    }
                }
            }
        }
    }
}
</style>
