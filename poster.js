class Poster{

constructor(){
    this.blogUrl = 'https://www.googleapis.com/blogger/v3/blogs/1565497246801184403/posts/',
    this.blogId = "1565497246801184403"
    this.token = 'ya29.GlvzBT8QNVoyhRwOz8hJCfZdvNdbDweKT3OQheSanl2Lq5FjJoSayL4pUy41q4rgqIHf9zTMx9KlojHVH_WCkufLfT91VnbTVAAAPFPjvu2SnvOkFIcTvyM2WQQp'
}

requestPostBlogger( title, content ){   
    let options = {
        url: this.blogUrl,
        headers: { Authorization: 'Bearer ' + this.token },
        //auth: token, 
        json: true,
        body: {
            kind: "blogger#post",
            blog: {
                    id: this.blogId
                    },
            title: title,
            content: content
        }
    }

    request.post(options).then((response)=>{console.log(response)}).catch((error)=>{console.log(error)})
}

}