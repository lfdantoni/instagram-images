const axios = require('axios');

exports.getInstImgUrl = async (instagramImgLink) => {

  const url = 'https://images' + ~~(Math.random() * 3333) + '-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=' + instagramImgLink;
  
  return axios.get(
    url
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
        console.log(jsonData.entry_data)
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