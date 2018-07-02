const delay = ms => new Promise(_ => setTimeout(_, ms));
const AppDownload = {
    template: `
        <v-app>
            <Youtube :video-id="videoId"></Youtube> 
            <Progress :status="status"></Progress>
        </v-app>
    `,
    props: ['videoId'],
    components: {
        Youtube,
        Progress
    },
    data() {
        return {
            status: {
                isFinished: false,
                error: null
            }
        };
    },
    created() {
        const apiTranscodeUrl = APP_IS_LOCAL ? `${APP_CONTEXT_PATH}/api/store/${this.videoId}` :
            `${APP_CONTEXT_PATH}/api/transcode/${this.videoId}`;

        fetch(apiTranscodeUrl)
            .then(res => {
                if (!res.ok) {
                    return res.text().then(err => Promise.reject(err));
                }
                return res;
            })
            .then(res => res.json())
            .then(({ key }) => this.startPolling(key))
            .catch(error => {
                this.status.error = error;
                this.status.isFinished = true;
                console.log('Poll failed');
            });
    },
    methods: {
        startPolling(key) {
            // if (!APP_IS_LOCAL) {
            //     return Promise.resolve();
            // }

            const pollWithKey = this.poll.bind(this, key);

            console.log('Poll started');
            return this.poll(key)
                .then(url => {
                    if (url) {
                        this.status.isFinished = true;

                        // this will initiate the download
                        window.location = url;
                    } else {
                        return delay(5000)
                            .then(() => this.poll(key));
                    }
                });
        },
        poll(key) {
            const apiCheckUrl = `${APP_CONTEXT_PATH}/api/signed-url/${key}`

            console.log('Poll... ');

            return fetch(apiCheckUrl)
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(err => Promise.reject(err));
                    }
                    return res;
                })
                .then(res => res.json())
                .then(({ url }) => url);
        }
    }
};