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
    props: {
        videoId: {
            type: String,
            required: true
        },
        isLocal: {
            type: Boolean,
        }
    },
    data() {
        return {
            state: {
                status: null,
                isError: false
            }
        };
    },
    created() {
        if (this.isLocal) {
            this.state.status = 'Start downloading now...';

            const apiDownloadUrl = `${APP_CONTEXT_PATH}/api/download/${this.videoId}?${transcodeMP3}`;

            // 1. simplest - this will initiate the download
            window.location = apiDownloadUrl;

            // 2. open a new tab
            // window.open(apiDownloadUrl, '_blank');

            // 3. Adding an anchor tag and clicking it
            // Note: if 'download' attribute is not set it will not work as click can be only forced only inside a User-Action "event tick"
            // const link = document.createElement('a');
            // link.href = apiDownloadUrl;
            // link.setAttribute('target', '_blank');
            // link.style.display = 'none';
            // link.setAttribute('download', ''); // This is obligatory to set 'download' attribute
            // document.body.appendChild(link);
            // link.click();
        } else {
            const apiTranscodeUrl = `${APP_CONTEXT_PATH}/api/transcode/${this.videoId}?${transcodeMP3}`;

            fetch(apiTranscodeUrl)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(err => Promise.reject(err));
                    }
                    return res;
                })
                .then(res => res.json())
                .then(({ key }) => this.awsStartPolling(key))
                .catch(({ error }) => {
                    this.state.status = error;
                    this.state.isError = true;
                    console.log('Poll failed');
                });
        }
    },
    methods: {
        awsStartPolling(key) {
            const poll = () => {
                return this.awsPoll(key)
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
        awsPoll(key) {
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