import I18n from 'react-native-i18n'
import en from './en';
import zh from './zh';
import fr from './fr';
import ru from './ru';
import zh_Hans from './zh_Hans';
import zh_Hant from './zh_Hant';

I18n.defaultLocale = 'en';

I18n.fallbacks = true;

I18n.translations = {
    'en': en,
    'fr': fr,
    'ru': ru,
    'zh': zh,
    'zh-CN': zh_Hans, // 国产机型-中国大陆
    'zh-HK': zh_Hant, // 国产机型-中国香港
    'zh-TW': zh_Hant, // 国产机型-中国台湾
    'zh-Hans': zh_Hans, // 国外机型-汉语简体
    'zh-Hant': zh_Hant  // 国外机型-汉语繁体
};

export default I18n;
