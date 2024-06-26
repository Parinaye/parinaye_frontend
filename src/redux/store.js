import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./user/userSlice.js";
import profileReducer from "./profile/profileSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
});

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
