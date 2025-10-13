class Invitation {
    constructor (id_invitation, id_client, id_branch, state_invitation) {
        this.id_invitation = id_invitation;
        this.id_client = id_client;
        this.id_branch = id_branch;
        this.state_invitation = state_invitation;
    }
}

module.exports = Invitation;