const axios = require('axios');

exports.getInstImgUrl = async (instagramImgLink) => {

  // const url = 'https://images' + ~~(Math.random() * 3333) + '-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=' + instagramImgLink;
  
  return axios.get(
      instagramImgLink,
      {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
          "Accept-Encoding": "gzip, deflate", 
          "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", 
          "Dnt": "1", 
          "Host": "instagram.com", 
          "Upgrade-Insecure-Requests": "1", 
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36", 
          "X-Amzn-Trace-Id": "Root=1-5ee7bae0-82260c065baf5ad7f0b3a3e3"
        }
      }
    )
    .then(resp => {
      const {data} = resp;
      try {
        const shareDataPos = data.indexOf('<script type="text/javascript">window._sharedData = ');
        let parse = data.substr(shareDataPos, data.length - shareDataPos);
        parse = parse.split('<script type="text/javascript">window._sharedData = ')[1];
        parse = parse.split('</script>')[0];
        parse = parse.substr(0, parse.length - 1);
  
        const jsonData = JSON.parse(parse);
        console.log(jsonData)
        if(checkCorrectInfo(jsonData)) {
          const mediaData = jsonData.entry_data.PostPage[0].graphql.shortcode_media;
          console.log(mediaData)
          if(mediaData.edge_sidecar_to_children) {
            const imgs = mediaData.edge_sidecar_to_children.edges;
  
            const results = imgs.map(i => i.node.display_url);
            return Promise.resolve(results);
          }

          return Promise.resolve(
            [mediaData.display_url]
          );
        }
      } catch (error) {
        Promise.reject(error)
      }
    })
  
}

const checkCorrectInfo = (jsonData) => !!(jsonData 
  && jsonData.entry_data
  && jsonData.entry_data.PostPage
  && jsonData.entry_data.PostPage[0]
  && jsonData.entry_data.PostPage[0].graphql
  && jsonData.entry_data.PostPage[0].graphql.shortcode_media);