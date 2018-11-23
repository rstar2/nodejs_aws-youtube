//eslint-disable-next-line
const AppList = {
    template: html`
        <List :list="list" @download="download">
            <template slot="title">{{ title }}</template>
        </List>
    `,
    components: {
        //eslint-disable-next-line
        List
    },
    props: ['list', 'title'],
    methods: {
        download(index) {
            const fileKey = this.list[index];

            console.log('Get signed-url', fileKey);

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
                        console.log(`Cannot get a signed-url for downloading ${fileKey}`);
                        this.$snackbar.show({
                            text: `Cannot get a signed-url for downloading ${fileKey}`,
                            color: 'error'
                        });
                        return;
                    }

                    console.log(`Download ${fileKey}`);
                    this.$snackbar.show({
                        text: `Start downloading ${fileKey}`,
                        color: 'success',
                        timeout: 2000
                    });
                    // request/download the signed url
                    window.location.href = url;
                })

                .catch(({ error }) => {
                    console.log(`Download ${fileKey} failed`, error);
                    this.$snackbar.show({
                        text: `Download ${fileKey} failed`,
                        color: 'error'
                    });
                });
        }
    }
};