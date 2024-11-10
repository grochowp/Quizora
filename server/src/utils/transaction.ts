import mongoose, { ClientSession } from "mongoose";

export async function withTransaction(
  callback: (session: ClientSession) => Promise<any>
) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
}
