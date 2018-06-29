const AppList = {
    name: 'app-list',
    template: `
      <vs-list>
        <!-- 
          Use the <template slot="title"/> passed from the parent.
          Cannot use <slot name="title"/> as we have to pass it to the 'vs-title' prop.
        -->
        <vs-list-header :vs-title="$slots.title[0].text" vs-color="primary"/>

        <div v-if="list.length">
            <!-- add custom class "list-item" -->
            <vs-list-item v-for="(item, index) of list" :key="index"
                vs-icon="check" :vs-title="item" class="list-item">
                <vs-button vs-color="danger" vs-icon="save_alt" @click="download(index)">Download</vs-button>
            </vs-list-item>
        </div>
        <div v-else>
            <vs-list-item vs-title="No Items" class="list-item"></vs-list-item>
        </div>


      </vs-list>
    `,
    props: ['list'],
    methods: {
        download(index) {
            const key = this.list[index];
            
            const downloadUrl = APP_IS_LOCAL ?
                APP_CONTEXT_PATH + '/api/aws/download' :
                APP_CONTEXT_PATH + '/api/signed-url';

            fetch(`${downloadUrl}/${encodeURIComponent(key)}`, {
                method: "GET",
                // method: "POST",
                // body: JSON.stringify({
                //     key
                // }),
                // headers: {
                //     "Content-Type": "application/json"
                // },
                credentials: "same-origin",
            })
                .then((res) => {
                    // handle HTTP response
                    // res.status     //=> number 100–599
                    // res.statusText //=> String
                    // res.headers    //=> Headers
                    // res.url        //=> String

                    if (!res.ok) {
                        return res.text().then(err => Promise.reject(err));
                    }

                    console.log(`Download ${key} success`);

                    // return res.json();
                    return res.text();
                })

                // request/download the signed url
                .then(signedUrl => {
                    window.location.href = signedUrl;
                })

                .catch(error => {
                    // TODO: handle network error or server error
                    console.log(`Download ${key} failed`, error);
                });
        }
    }
};