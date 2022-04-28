import {mapState} from "vuex";


export const matchScoreScreenshotsMixin = {
    computed: {
        ...mapState({
            match: state => state.tournaments.match,
        }),
        isAnyScreenshotsInMatch() {
            let screenshots = this.match.scores[0].attachments.concat(this.match.scores[1].attachments);

            return !!screenshots.length;
        }
    },
}
