import 'dotenv/config'
export const ENV ={
	PORT:process.env.PORT || 5000,
	MONGO_URI:process.env.MONGO_URI || 'mongodb://localhost:27017/bookadzone',
	ADMIN_EMAIL:process.env.ADMIN_EMAIL || "",
	JWT_SECRET:process.env.JWT_SECRET || "",
	JWT_EXPIRE_TIME:process.env.JWT_EXPIRE_TIME || ""
}