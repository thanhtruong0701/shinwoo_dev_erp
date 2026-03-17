<template>
<v-container fluid>
    <iframe width="100%" height="800" :src="src" crossorigin="true" @load="onLoad"></iframe>
</v-container>
</template>

<script>
export default {
    layout: 'default',
    middleware: 'user',

    data: () => ({
        src: ""
    }),
    asyncData({
        env
    }) {
        return {
            sso_url: env.SSO_URL
        }
    },
    created() {
        this.form = this.$route.query.objId;
        this.getSSOToken();
    },
    methods: {
        async getSSOToken() {
            try {
                const res = await this.$axios.$post("user/getssotoken", {
                    encrypt_type: "java"
                });
                console.log(res)
                if (res.data.ssotoken) {
                    this.src = `${this.sso_url}/system/sso_form.gw?objId=${this.form}&token=${res.data.ssotoken}`;
                    console.log(this.src)
                }
            } catch (e) {
                console.log(e)
            }
        },
        onLoad() {
            console.log("onloaded")
        },
    }
}
</script>
