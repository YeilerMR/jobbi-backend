const { createConnection } = require("../../utils/database/dbconnection");

async function createAssociationUserGift(userId, giftId) {
    let connection;
    try {
        connection = await createConnection();

        const userPoints = await getPointsByUser(userId);

        const totalPoints = userPoints.total_points;
        const redeemedPoints = userPoints.redeemed_points;

        const giftPoints = await getPointsByGift(giftId);
        const pointsLeft = totalPoints - giftPoints;

        if (pointsLeft < 0) {
            throw new Error("You don't have enough points to redeem this reward. Don't give up!");
        }

        let totalRedeemedPoints = redeemedPoints + giftPoints;

        await updateUserPoints(userId, pointsLeft, totalRedeemedPoints);

        const [result] = await connection.execute(
            `
            INSERT INTO User_Gift (id_user, id_gift, gift_date, redeemed, is_active)
            VALUES (?, ?, NOW(), 1, 0)
            `,
            [userId, giftId]
        );

        const insertedId = result.insertId;

        const newGift = await getGiftUserByUserGift(insertedId);

        return newGift;

    } catch (error) {
        console.error("Error creating association user-gift:", error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

async function updateUserPoints(userId, totalPoints, totalRedeemedPoints) {
    const connection = await createConnection();
    try {
        const [result] = await connection.execute(
            `
            UPDATE ClientPoints 
            SET total_points = ?, redeemed_points = ?, last_update = NOW() 
            WHERE id_user = ?
            `,
            [totalPoints, totalRedeemedPoints, userId]
        );

        return result.affectedRows > 0; // returns true if updated successfully
    } finally {
        await connection.end();
    }
}

async function getGiftUserByUserGift(idUserGift) {
    let connection;
    try {
        connection = await createConnection();

        const [rows] = await connection.execute(
            `
            SELECT 
                us.id_user_gift,
                us.id_user,
                us.id_gift,
                g.name AS gift_name,
                g.description,
                g.discount,
                g.for_role,
                g.min_points,
                g.reward_type,
                us.gift_date,
                us.redeemed,
                us.is_active
            FROM User_Gift us
            INNER JOIN Gifts g ON us.id_gift = g.id_gift
            WHERE us.id_user_gift = ?
            `,
            [idUserGift]
        );

        return rows[0] || null;
    } catch (error) {
        console.error("Error fetching gift by user gift ID:", error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

async function getPointsByUser(userId) {
    const connection = await createConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT total_points, redeemed_points FROM ClientPoints WHERE id_user = ?`,
            [userId]
        );

        if (!rows.length) throw new Error("User not found in ClientPoints");

        return rows[0];
    } finally {
        await connection.end();
    }
}

async function getPointsByGift(giftId) {
    const connection = await createConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT min_points FROM Gifts WHERE id_gift = ?`,
            [giftId]
        );

        if (!rows.length) throw new Error("Gift not found");

        return rows[0].min_points;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createAssociationUserGift,
};
