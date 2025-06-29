import { makeAutoObservable } from "mobx";

export default class VideoStore {
    _categories = [];
    _videos = [];
    _selectedCategory = {};

    constructor() {
        makeAutoObservable(this);
    }

    setCategories(categories) {
        this._categories = categories;
    }
    setVideos(videos) {
        this._videos = videos;
    }
    setSelectedCategory(category) {
        this._selectedCategory = category;
    }

    get categories() {
        return this._categories;
    }
    get videos() {
        return this._videos;
    }
    get selectedCategory() {
        return this._selectedCategory;
    }
}
