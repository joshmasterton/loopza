export const user = async (req, res) => {
    try {
        return res.json(req.user);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "Error getting user" });
    }
};
