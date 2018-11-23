FROM python

VOLUME [ "/exodus" ]
    
# 0. curl is already there
# 1. install zip
# 2. install ffmpeg
# 3. install exodus
# 4. create an ffmpeg exodus bundle
# 5. create an aws-artifact zip
RUN apt-get update && apt-get install -y --no-install-recommends \
    zip \
    ffmpeg


RUN \
    pip install --user exodus-bundler && \
    export PATH="~/.local/bin/:${PATH}"
 
CMD [ "/bin/bash" ]    


# TODO: Check https://github.com/techinasia/amazon-linux-python3.6/blob/master/Dockerfile
