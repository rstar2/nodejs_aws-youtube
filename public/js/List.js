const List = {
    template: `
      <v-layout row>
        <v-flex xs12 sm8 offset-sm2>

            <v-toolbar color="light-blue" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
  
              <v-toolbar-title>
                <slot name="title">My List</slot>
              </v-toolbar-title>
  
              <v-spacer></v-spacer>
  
              <v-btn icon>
                <v-icon>search</v-icon>
              </v-btn>
  
              <v-btn icon>
                <v-icon>view_module</v-icon>
              </v-btn>
            </v-toolbar>
  
            <v-list>
              <v-list-tile v-for="(item, index) of list" :key="index" avatar @click="">
                <v-list-tile-action>
                  <v-icon class="amber white--text">folder</v-icon>
                </v-list-tile-action>
  
                <v-list-tile-content>
                  <v-list-tile-title>{{ item }}</v-list-tile-title>
                </v-list-tile-content>
  
                <v-list-tile-action>
                  <!-- <v-btn icon ripple> -->
                    <v-icon color="grey lighten-1">info</v-icon>
                  <!-- </v-btn> -->
                </v-list-tile-action>
              </v-list-tile>
  
              <v-divider inset></v-divider>
            </v-list>
            
        </v-flex>
      </v-layout>
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