//eslint-disable-next-line
const AppList = {
    template: html`
        <v-app>
            <List :list="list" @download="download">
                <template slot="title">{{ title }}</template>
            </List>
            <v-snackbar :value="error" :top="true" :right="true" :absolute="true">
                {{ error }}
                <v-btn icon flat @click="error = ''" >
                    <v-icon color="pink">close</v-icon>
                </v-btn>
            </v-snackbar>
        </v-app>
    `,
    components: {
        //eslint-disable-next-line
        List
    },
    props: ['list', 'title'],
    data() {
        return {
            error: ''
        };
    },
    methods: {
        download(index) {
            const fileKey = this.list[index];

            console.log('GEt signed-url', fileKey);

            const signedUrl = APP_IS_LOCAL ?
                APP_CONTEXT_PATH + '/api/aws/signed-url' :
                APP_CONTEXT_PATH + '/api/signed-url';

            fetch(`${signedUrl}/${encodeURIComponent(fileKey)}${APP_IS_LOCAL ? '' : '?isFileKey=true'}`, {
                // method: "POST",
                // body: JSON.stringify({
                //     fileKey: fileKey
                // }),
                // headers: {
                //     "Content-Type": "application/json"
                // },
            })
                .then(res => {
                    // handle HTTP response
                    // res.status     //=> number 100–599
                    // res.statusText //=> String
                    // res.headers    //=> Headers
                    // res.url        //=> String

                    if (!res.ok) {
                        return res.json().then(err => Promise.reject(err));
                    }

                    return res.json();
                })

                .then(({ url }) => {
                    if (!url) {
                        this.error = `Cannot get a signed-url for downloading ${fileKey}`;
                        return;
                    }

                    console.log(`Download ${fileKey}`);
                    // request/download the signed url
                    window.location.href = url;
                })

                .catch(({ error }) => {
                    console.log(`Download ${fileKey} failed`, error);
                    this.error = error || `Download ${fileKey} failed`;
                });
        }
    }
};