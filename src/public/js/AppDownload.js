const delay = ms => new Promise(_ => setTimeout(_, ms));

const transcodeMP3 = new URLSearchParams(window.location.search).has('mp3') ? 'mp3' : '';

//eslint-disable-next-line
const AppDownload = {
    template: html`
        <div>
            <Youtube :video-id="videoId"></Youtube>
            <Progress :state="state"></Progress>
        </div>
    `,
    components: {
        //eslint-disable-next-line
        Youtube,
        //eslint-disable-next-line
        Progress
    },
    props: ['videoId'],
    data() {
        return {
            state: {
                status: null,
                isError: false
            }
        };
    },
    created() {
        const apiTranscodeUrl = `${APP_CONTEXT_PATH}/api/transcode/${this.videoId}?${transcodeMP3}`;

        fetch(apiTranscodeUrl)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => Promise.reject(err));
                }
                return res;
            })
            .then(res => res.json())
            .then(({ key }) => this.startPolling(key))
            .catch(({ error }) => {
                this.state.status = error;
                this.state.isError = true;
                console.log('Poll failed');
            });
    },
    methods: {
        startPolling(key) {
            const poll = () => {
                return this.poll(key)
                    .then(url => {
                        if (url) {
                            this.state.status = 'Start downloading now...';

                            // this will initiate the download
                            window.location = url;
                            return Promise.resolve();
                        }

                        // wait some seconds and repeat the same poll
                        return delay(2000)
                            .then(() => poll());
                    });
            };

            console.log('Poll started');
            return poll();
        },
        poll(key) {
            const apiCheckUrl = `${APP_CONTEXT_PATH}/api/signed-url/${encodeURIComponent(key)}?${transcodeMP3}`;

            console.log('Poll... ');

            return fetch(apiCheckUrl)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(err => Promise.reject(err));
                    }
                    return res;
                })
                .then(res => res.json())
                .then(({ url }) => url);
        }
    }
};