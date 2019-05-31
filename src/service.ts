import {Http} from "./services/http";
import {RootStore} from "./state/root_store";


const getInterceptor = (url: string) => {
    console.log('Intercepted ', url)
    const m = url.match('\/category\/(.+)$');
    if (m) {
        const id = m[1];
        return {
            id: id,
            content_type: 'story',
            meta: {story_type: 'main_story'},
            title: 'Lie in Kamihama',
            subtitle: 'Chapter 8',
            description: 'Synopsys',
            parent_id: 'root_id',
            index: 1,
            children: [{
                content_type: "episode",
                created_at: "2019-05-24T02:27:24.101+00:00",
                description: "",
                id: "5ce7568c0b9ab8148a594dd7",
                index: null,
                meta: {story_type: null},
                parent_id: "5ce756390b9ab8148a594dd6",
                resources_prefix: "http://files.magireco-story.hajinomura.fun/images/",
                subtitle: "О-1",
                title: "Общая 1",
                updated_at: "2019-05-24T02:27:24.101+00:00",
            }, {
                content_type: "episode",
                created_at: "2019-05-24T09:34:32.316+00:00",
                description: "",
                id: "5ce7baa80b9ab82a137d6105",
                index: null,
                meta: {story_type: null},
                parent_id: "5ce756390b9ab8148a594dd6",
                resources_prefix: "http://files.magireco-story.hajinomura.fun/images/",
                subtitle: "О-2",
                title: "Общая 2",
                updated_at: "2019-05-24T09:34:32.316+00:00",
            }]
        }
    }
};


const httpService = new Http();
httpService.interceptors.get = getInterceptor;

export const http = () => {
    return httpService;
};

export const saveToken = (token: string) => {
    window.localStorage.setItem("token", token)
};

export const removeToken = () => {
    window.localStorage.removeItem('token')
};

const rootStore = new RootStore();
rootStore.ui.initializeRouter();

export const store = () => {
    return rootStore
};