const teamName = "Reviewers";

const githubUsers = {
    // github_name: rocketchat_name
    "armandfardeau": "@armandfardeau",
    "Quentinchampenois": "@quentin",
    "moustachu": "@moustachu",
    "Dynnammo": "@baptiste",
    "MoretS": "@seb",
    "Quentin-Bernigaud": "@nimbus",
    "virgile-dev": "@virgile",
    "paulinebessoles": "@pops"
};

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

const GithubUsersToRocketUsers = (login) => {
    if (githubUsers.hasOwnProperty(login)) {
        return githubUsers[login];
    } else {
        return login;
    }
};

const users = (obj) => {
    const reviewers = obj.pull_request.requested_reviewers.map((elem) => {
        return GithubUsersToRocketUsers(elem.login);
    });

    if (reviewers.length > 1) {
        return reviewers.join(" / ");
    } else {
        return reviewers[0];
    }
};

const buildMessage = (obj) => {
    const pr = obj.pull_request.html_url;
    const reviewers = users(obj);

    let template = `[A review has been requested](${pr}) for ${reviewers}`;

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
