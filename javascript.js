//"https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=Shriram&key=AIzaSyBC9N7ib0CThl-d5Iwnz0tDjVB2iUTh4-U";

//https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=IN&key=AIzaSyBC9N7ib0CThl-d5Iwnz0tDjVB2iUTh4-U

const apiKey = "AIzaSyDP3jg1nKpBhaz1sYniA9pdEItddT5z8O0";
const searchInput = document.getElementById("search-input");
const button = document.getElementById("search-btn");
const container = document.getElementById("container");

button.addEventListener("click", ()=>{
    let searchValue = searchInput.value;
    //fetch the list of videos
    fetchVideos(searchValue);
})

async function byDefaultFetch(){

    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=IN&key=AIzaSyBC9N7ib0CThl-d5Iwnz0tDjVB2iUTh4-U`;
   
    try{
        
    let response = await fetch(endpoint);
    let results = await response.json();
    for(let i = 0; i < results.items.length; i++){
        let videoItem = results.items[i];
        let videoStats = await fetchStats(videoItem.id.videoId);
        //adding terms in array
        if(videoStats.items.length>0){
        videoItem.videoStats = videoStats.items[0].statistics;
        videoItem.duration = videoStats.items[0].contentDetails.duration;
        }
    }
    //show thumnails
    showThumbnails(results.items)
    }
    catch (error) {
        console.log("Error : ", error);
    }
}

    byDefaultFetch();

async function fetchVideos(searchValue) {
    //calling api

    let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchValue}&key=${apiKey}`     
    try{
        let response = await fetch(endpoint); //getting all data
        let results = await response.json();
        console.log(results);
        //get videos info data
        //get video status
        for(let i = 0; i < results.items.length; i++){
            let videoItem = results.items[i];
            let videoStats = await fetchStats(videoItem.id.videoId);
            //adding terms in array
            if(videoStats.items.length>0){
            videoItem.videoStats = videoStats.items[0].statistics;
            videoItem.duration = videoStats.items[0].contentDetails.duration;
            }
        }
        //show thumnails
        showThumbnails(results.items)
        
    }
    catch (error) {
        console.log("Error : ", error);
    }
}

async function fetchStats(videoid){
    const endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${videoid}&maxResults=25&key=${apiKey}`;
    
        let response = await fetch(endpoint);
        let results = await response.json();
        return results;   
}

function showThumbnails(items) {
    container.innerHTML = '';
    items.forEach((item)=>{
        const thumbnailsUrl = item.snippet.thumbnails.medium.url;
        
        let videoContainer = document.createElement("div");
        videoContainer.className = "videoContainer";

        // getDuration(item.duration);

        //container contains
         videoContainer.innerHTML = `
         <img class="thumbnail-img" src="${thumbnailsUrl}" />
         <b class="duration"></b>
         <div class="content">
           <img src="${item.snippet.thumbnails.default.url}" alt="" class="channelIcon" />
           <div class="videoInfo">
             <h4 class="title">${item.snippet.title}</h4>
             <p class="channel-title">${item.snippet.channelTitle}</p>
             <p class="views">${item.videoStats ? getViews(item.videoStats.viewCount) : "NA" + "views"}</p>
           </div>
         </div>
        `; 
        container.append(videoContainer);

        //clicking on image should direct to that video pg
        videoContainer.addEventListener("click",()=>{
            if(item.id.videoId){
                navigateToClickedVideo(item.id.videoId);
            }
            else{
                navigateToClickedVideo(item.id.channelId);
            }
        });

    })

}

function navigateToClickedVideo(videoid) {
    //using cookie 
    let path = `/video.html`;
    if(videoid){
        document.cookie = `video_id=${videoid};path=${path}`;
        let linkElement = document.createElement("a");
        linkElement.href = "https://patildivyani.github.io/YouTube_Clone/video.html";
        linkElement.target="_blank";
        linkElement.click();
    }
    else{
        alert("Not Available!");
    }
}


function getDuration(duration) {
    // "contentDetails": {
    //     "duration": "PT21M3S",
    console.log(duration);
    return "";
    // if(!duration) { return ""};
    // let i = duration.length-1; 
    // let sec="";
    // let min="";
    // let hrs="";
    // while(i>=0){
    //     if(duration[i]==="S"){
    //         i--;
    //         while(duration[i]!=="M" || duration[i]!=="T"){ 
    //             sec = duration[i] + sec;
    //             i--;
    //         }
    //     }
    //     console.log(sec);
    //     i--;
    //     while(duration[i]!=="H" || duration[i]!=="T"){    
    //         min = duration[i] + min;
    //         i--;
    //     }
    //     i--;
    //     while(duration[i]!=="T"){    
    //         hrs = duration[i] + hrs;
    //         i--;
    //     }
    //     break;
    // }
    // return `${hrs}:${min}:${sec}`;
}
function getViews(num) {
    if(num < 1000){ return num; }
    else if(num>=1000 && num<1000000){
        return (num/1000).toFixed(2) + "K" + " ";
    }
    return (num/1000000).toFixed(2) + "M" + " ";
}
