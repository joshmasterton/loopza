export const getUser = (_req, res) => {
    try {
        return res.status(200).json({ message: "getUser" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "get posts or comments has occured" });
    }
};
