const teamName = "Product";

const isReviewNotification = (obj) => {
    return obj.action === "review_requested"
};

const isForTeamReviewers = (obj) => {
    if (obj.requested_team !== undefined) {
        return obj.requested_team.name === teamName
    } else {
        return false;
    }

};

const buildMessage = (obj) => {
    const pr = obj.pull_request.html_url;

    let template = `[A review has been requested](${pr}) for @pops`;

    return {
        text: template
    };
};

/* exported Script */
class Script {
    /**
     * @params {object} request
     */
    process_incoming_request({request}) {
        if (isReviewNotification(request.content) && isForTeamReviewers(request.content)) {
            return {
                content: {
                    text: buildMessage(request.content).text
                }
            };
        }
    }
}
