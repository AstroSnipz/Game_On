import express from "express";
import axios from "axios";

const app  = express();
const port = 3000;
const API_URL = "https://www.scorebat.com/video-api/v3/feed/?token=[MTMyNDM5XzE3MDExMTQzNzdfN2ExOTkxNGYyMjc1ZDQ2MjIyYzVjMTRiYTE3ODgxYzBiYzQ3YWIzNA==]"

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL);
        const matchesByCompetition = {};

        result.data.response.forEach(match => {
            const competition = match.competition;
            if (!matchesByCompetition[competition]) {
                matchesByCompetition[competition] = [];
            }
            matchesByCompetition[competition].push({
                title: match.title,
                thumbnail: match.thumbnail,
                matchviewUrl: match.matchviewUrl,
                competitionUrl: match.competitionUrl,
                date: match.date,
                videos: match.videos.map(video => video.embed)
            });
        });

        const competitions = Object.keys(matchesByCompetition);
        res.render("index.ejs", {
            content: JSON.stringify(result.data),
            competitions: competitions,
            matchesByCompetition: matchesByCompetition
        });
    } catch (error) {
        res.render("index.ejs", {
            content: JSON.stringify(error.result.data)
        });
    }
});


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})


/*Note
1. Frontend
*/
