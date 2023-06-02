let cookieString = document.cookie;
let videoId =  cookieString.split("=")[1];
// const apiKey = localStorage.getItem("apiKey")
const apiKey = "AIzaSyDP3jg1nKpBhaz1sYniA9pdEItddT5z8O0";

let firstScript = document.getElementsByTagName("script")[0] ;

firstScript.addEventListener("load", onLoadScript)

function onLoadScript() {
  if (YT) {
    new YT.Player("play-video", {
      height: "500",
      width: "850",
      videoId,
      events: {
        onReady: (event) => {
            document.title = event.target.videoTitle ;
            extractVideoDetails(videoId);
            fetchStats(videoId)
        }
      }
    });
  }
}

const statsContainer = document.getElementsByClassName("videoContent")[0] ;

async function extractVideoDetails(videoId){ 
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;

    try {
        let response = await fetch(endpoint);
        let result = await response.json();
        console.log(result, "comments")
        renderComments(result.items);
    }
    catch(error){
        console.log(`Error occured`, error)
    }
    
}

async function  fetchStats(videoId){
    console.log("Inside fetchStats")
    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apiKey}&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        const item = result.items[0] ;
        const title = document.querySelector(".title");
        title.innerHTML = item.snippet.title ;
        // title.style.color = "black";
        // title.style.fontSize = "20px"
        
        statsContainer.innerHTML = `
            <img src="${item.snippet.thumbnails.default.url}" alt="" class="channelIcon" />
            <div class="video-details"> 
                <h3 class="channel-title">${item.snippet.channelTitle}</h3>
                <p class="views">157M subscribers</p>    
            </div>
            <button class="subscribe">Subscribe</button>
        <div class="stats">
            <div class="like-container">
                <div class="like">
                    <span class="material-icons">
                    <img src="./img/thumbs-up.png" alt="up">
                    </span>
                    <span>${(item.statistics.likeCount)/1000 + "K"}</span>
                </div>
                <div class="dis-like">
                    <span class="material-icons">
                    <img src="./img/thumbs-down.png" alt="up">
                    </span>
                </div>
            </div>
            <div class="comments-container">
                <span class="material-icons">comment</span>
                <span>${item.statistics.commentCount}</span>
            </div>
        </div>
        `
    }
    catch(error){
        //TODO: handle error later
        console.log("error", error)
    }
}

 

function renderComments(commentsList) {
    const commentsContainer = document.getElementById("comments-container"); 
    // commentsContainer.
    for(let i =  0; i < commentsList.length ; i++) {
        let comment = commentsList[i] ;
        const topLevelComment = comment.snippet.topLevelComment ;

        let commentElement = document.createElement("div");
        commentElement.className = "comment" ;
        commentElement.innerHTML = `
                <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="">
                <div class="comment-right-half">
                    <b>${topLevelComment.snippet.authorDisplayName
                    }</b>
                    <p>${topLevelComment.snippet.textOriginal}</p>
                    <div style="display: flex; gap: 20px">
                        <div class="like">
                            <span class="material-icons">
                                <img src="./img/thumbs-up.png" alt="up">
                            </span>
                            <span>${topLevelComment.snippet.likeCount}</span>
                        </div>
                        <div class="like">
                            <span class="material-icons">
                            <img src="./img/thumbs-down.png" alt="up">
                            </span>
                        </div>
                        <button class="reply" onclick="loadComments(this)" data-comment-id="${topLevelComment.id}">
                            Replies(${comment.snippet.totalReplyCount})
                        </button>
                    </div>
                </div>
            `;
        commentsContainer.append(commentElement);

    }
}

async function loadComments(element){
    const commentId = element.getAttribute("data-comment-id");
    console.log(commentId)
    let endpoint = `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${apiKey}`;
    try {
       const response =  await fetch(endpoint);
        const result = await response.json();
        const parentNode = element.parentNode.parentNode ;
        let commentsList = result.items ;
        for(let i = 0 ; i < commentsList.length ; i++) {
            let replyComment =  commentsList[i] ; 
            let commentNode = document.createElement("div");
            commentNode.className = "comment comment-reply";

            commentNode.innerHTML = `
                        <img src="${replyComment.snippet.authorProfileImageUrl}" alt="">
                        <div class="comment-right-half">
                            <b>${replyComment.snippet.authorDisplayName}</b>
                            <p>${replyComment.snippet.textOriginal}</p>
                            <div class="options">
                                <div class="like">
                                    <span class="material-icons">
                                    <img src="./img/thumbs-up.png" alt="up">
                                    </span>
                                    <span>${replyComment.snippet.likeCount}</span>
                                </div>
                                <div class="like">
                                    <span class="material-icons">
                                    <img src="./img/thumbs-down.png" alt="up">
                                    </span>
                                </div>
                            </div>
                    `;

                parentNode.append(commentNode);
        }
    }   
    catch(error){

    }
}