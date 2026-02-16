const commandLocalizations = {
    // Help command
    help: {
        name: 'help',
        nameLocalizations: {
            vi: 'trợ-giúp'
        },
        description: 'Shows the usage and functions of all commands.',
        descriptionLocalizations: {
            vi: 'Hiển thị cách sử dụng và chức năng của tất cả các lệnh.'
        }
    },

    changelog: {
        name: 'changelog',
        nameLocalizations: {
            vi: 'nhật-ký-thay-đổi'
        },
        description: 'View the latest changelog.',
        descriptionLocalizations: {
            vi: 'Xem nhật ký thay đổi mới nhất.'
        }
    },

    // Anime commands
    anime: {
        name: 'anime',
        nameLocalizations: {},
        description: 'Search for information about a specific anime.',
        descriptionLocalizations: {
            vi: 'Tìm kiếm thông tin về một bộ anime cụ thể.'
        }
    },

    characters: {
        name: 'characters',
        nameLocalizations: {
            vi: 'nhân-vật'
        },
        description: 'Search for information about a specific character.',
        descriptionLocalizations: {
            vi: 'Tìm kiếm thông tin về một nhân vật cụ thể.'
        }
    },

    character_search: {
        name: 'charactersearch',
        nameLocalizations: {
            vi: 'tìm-nhân-vật'
        },
        description: 'Search for anime series that contain character.',
        descriptionLocalizations: {
            vi: 'Tìm kiếm thông tin về một nhân vật cụ thể.'
        }
    },

    manga: {
        name: 'manga',
        nameLocalizations: {},
        description: 'Search for information about a specific manga.',
        descriptionLocalizations: {
            vi: 'Tìm kiếm thông tin về một bộ manga cụ thể.'
        }
    },


    popular: {
        name: 'popular',
        nameLocalizations: {
            vi: 'phổ-biến'
        },
        description: 'Get the list of 10 popular anime on AniList.',
        descriptionLocalizations: {
            vi: 'Lấy danh sách 10 anime phổ biến.'
        }
    },

    random: {
        name: 'random',
        nameLocalizations: {
            vi: 'ngẫu-nhiên'
        },
        description: 'Get random anime.',
        descriptionLocalizations: {
            vi: 'Lấy anime ngẫu nhiên.'
        }
    },

    schedule: {
        name: 'schedule',
        nameLocalizations: {
            vi: 'lịch-phát'
        },
        description: 'Get the airing schedule for a specific season.',
        descriptionLocalizations: {
            vi: 'Lấy lịch phát sóng anime.'
        }
    },

    search: {
        name: 'search',
        nameLocalizations: {
            vi: 'tìm-kiếm'
        },
        description: 'Search anime by image. (Supports maximum file size of 25MB)',
        descriptionLocalizations: {
            vi: 'Tìm kiếm anime bằng hình ảnh. (Hỗ trợ dung lượng ảnh tối đa 25MB)'
        }
    },

    staff: {
        name: 'staff',
        nameLocalizations: {
            vi: 'nhân-viên'
        },
        description: 'Search for information about a specific staff.',
        descriptionLocalizations: {
            vi: 'Tìm kiếm thông tin về một nhân viên cụ thể.'
        }
    },

    studio: {
        name: 'studio',
        nameLocalizations: {},
        description: 'Get information about the studio and a list of anime produced by the studio.',
        descriptionLocalizations: {
            vi: 'Lấy thông tin về studio và danh sách anime được sản xuất bởi studio.'
        }
    },

    trending: {
        name: 'trending',
        nameLocalizations: {
            vi: 'thịnh-hành'
        },
        description: 'Get a list of 10 trending anime on AniList.',
        descriptionLocalizations: {
            vi: 'Hiển thị danh sách 10 bộ anime đang thịnh hành trên AniList.'
        }
    },

    user: {
        name: 'user',
        nameLocalizations: {
            vi: 'người-dùng'
        },
        description: 'Get information about a specific user.',
        descriptionLocalizations: {
            vi: 'Xem thông tin về người dùng trên AniList.'
        }
    },

    // Other commands
    avatar: {
        name: 'avatar',
        nameLocalizations: {
            vi: 'ảnh-đại-diện'
        },
        description: 'Get the avatar of a user.',
        descriptionLocalizations: {
            vi: 'Lấy ảnh đại diện của người dùng.'
        }
    },

    stats: {
        name: 'stats',
        nameLocalizations: {
            vi: 'stats'
        },
        description: 'Get bot information.',
        descriptionLocalizations: {
            vi: 'Lấy thông tin về bot.'
        }
    },

    weather: {
        name: 'weather',
        nameLocalizations: {
            vi: 'thời-tiết'
        },
        description: 'Get the weather for a specific location.',
        descriptionLocalizations: {
            vi: 'Xem thông tin thời tiết của một địa điểm cụ thể.'
        }
    },

    ratelimit: {
        name: 'ratelimit',
        nameLocalizations: {
            vi: 'giới-hạn-yêu-cầu'
        },
        description: 'Get information about the rate limit of all APIs.',
        descriptionLocalizations: {
            vi: 'Xem thông tin về giới hạn yêu cầu của tất cả API.'
        }
    },

    donate: {
        name: 'donate',
        nameLocalizations: {
            vi: 'ủng-hộ'
        },
        description: 'Get information about how to support the project.',
        descriptionLocalizations: {
            vi: 'Lấy thông tin về cách ủng hộ dự án.'
        }
    },

    // Minecraft commands
    mcuser: {
        name: 'mcuser',
        nameLocalizations: {
            vi: 'mc-người-dùng'
        },
        description: 'Get information about a Minecraft user.',
        descriptionLocalizations: {
            vi: 'Lấy thông tin về người chơi Minecraft.'
        }
    }
};

// Response messages
const responseMessages = {
    global: {
        en: {
            tracemoe_api_limit: "Because of the trace.moe server's limited requirements, you can only use this command once every 60 minutes.",
            ready: "Ready",
            status_ready: "Bot status ready",
            command_error: "An error occurred while executing the command: ",
            command_register: "Command registered",
            waiting_command: "Waiting for register command...",
            guild_join: "Joined a new server: ",
            command_register_error: "Error when registering command: ",
            server_register_error: "Error when registering command for server: ",
            preview_button: "Preview",
            next_button: "Next",
            page: "Page",
            unavailable: "Unavailable",
            no_description: "No description.",
            description: "Description",
            error: "Error: ",
            error_reply: "An error occurred. Please try again later.",
            no_results: "No results found for search: ",
            nsfw_block: "AniChan block content: ",
            nsfw_block_reason: "__Reason:__ To protect your server from Discord's service, AniChan blocks search results containing 18+ content.",
            episodes: "Episodes",
            chapters: "Chapters",
            genres: "Genres",
            status: "Status",
            average_score: "Average score",
            mean_score: "Mean score",
            season: "Season",
            studio: "Studio",
            minute: "minute",
            retry: "Retry",
            random_again: "Random Again",
            view_anilist: "View on AniList"
        },
        vi: {
            tracemoe_api_limit: "Vì bị giới hạn yêu cầu đến máy chủ trace.moe, bạn chỉ có thể sử dụng lệnh này mỗi 60 phút một lần.",
            ready: "Sẵn sàng",
            status_ready: "Trạng thái bot sẵn sàng",
            command_error: "Đã xảy ra lỗi khi thực hiện lệnh này.",
            command_register: "Đã đăng ký lệnh",
            waiting_command: "Đang đăng kí lệnh...",
            guild_join: "Đã tham gia máy chủ: ",
            command_register_error: "Lỗi khi đăng ký lệnh: ",
            server_register_error: "Lỗi khi đăng ký lệnh cho máy chủ: ",
            preview_button: "Trang trước",
            next_button: "Trang sau",
            unavailable: "không xác định",
            no_description: "Không có mô tả",
            description: "Mô tả",
            error: "Lỗi: ",
            error_reply: "Đã xảy ra lỗi khi tìm kiếm thông tin. Vui lòng thử lại sau.",
            no_results: "Không tìm thấy: ",
            nsfw_block: "AniChan đã chặn kết quả tìm kiếm: ",
            nsfw_block_reason: "__Lý do:__ Để bảo vệ máy chủ của bạn khỏi điều khoản dịch vụ của Discord, AniChan chặn các kết quả tìm kiếm chứa nội dung người lớn.",
            episodes: "Số Tập",
            chapters: "Số Chương",
            genres: "Thể loại",
            status: "Trạng thái",
            average_score: "Điểm đánh giá",
            mean_score: "Điểm xếp hạng",
            season: "Mùa",
            studio: "Studio",
            minute: "phút",
            retry: "Thử lại sau",
            page: "Trang",
            random_again: "Random Lại",
            view_anilist: "Xem trên AniList"
        }
    },
    
    anime: {
        en: {
            anime_name: "Anime name"
        },
        vi: {
            anime_name: "Tên anime"
        }
    },

    character: {
        en: {
            command_description: "Search for information about a specific character.",
            character_name: "Character name",
            anime_appearances: "Anime appearances"
        },
        vi: {
            command_description: "Tìm kiếm thông tin về một nhân vật cụ thể.",
            character_name: "Tên nhân vật",
            anime_appearances: "Xuất hiện trong anime: "
        }
    },

    character_search: {
        en: {
            command_description: "Search for anime series that contain character.",
            character_name: "Character name",
            anime_list: "List of anime containing characters: "
        },
        vi: {
            command_description: "Tìm kiếm các bộ anime có chứa nhân vật.",
            character_name: "Tên nhân vật",
            anime_list: "Danh sách anime chứa nhân vật: "
        }
    },

    manga: {
        en: {
            manga_name: "Manga name"
        },
        vi: {
            manga_name: "Tên manga"
        }
    },

    studio: {
        en: {
            studio_name: "Studio name",
            product_year: "Year",
            studio_info: "Studio Information:",
            product_list: "Productions by"
        },
        vi: {
            studio_name: "Tên studio",
            product_year: "Năm",
            studio_info: "Thông tin Studio:",
            product_list: "Sản phẩm của"
        }
    },

    staff: {
        en: {
            staff_name: "Staff name",
            staff_info: "Staff Information"
        },
        vi: {
            staff_name: "Tên nhân viên",
            staff_info: "Thông tin Nhân viên"
        }
    },

    schedule: {
        en: {
            airing_schedule: "Airing Schedule"
        },
        vi: {
            airing_schedule: "Lịch Phát Sóng"
        }
    },

    search: {
        en: {
            image_option: "Search by image",
            image_link: "Image URL",
            upload_image: "Upload image",
            cut_black_borders: "Cut black borders",
            similarity: "Similarity",
            appears_episode: "Appears in episode: ",
            file_too_large: "File too large. Maximum file size is 25MB.",
            tracemoe_api_limit: "The request limit for the trace.moe server has been reached. Please try again later."
        },
        vi: {
            image_option: "Tìm kiếm bằng hình ảnh",
            image_link: "Liên kết ảnh",
            upload_image: "Tải ảnh lên",
            cut_black_borders: "Cắt viền đen",
            similarity: "Tỉ lệ trùng khớp",
            appears_episode: "Xuất hiện trong tập: ",
            file_too_large: "Dung lượng ảnh quá lớn. Vui lòng thử lại với ảnh có dung lượng nhỏ hơn 25MB.",
            tracemoe_api_limit: "Đã đạt giới hạn yêu cầu đến máy chủ trace.moe. Vui lòng thử lại sau."
        }
    },

    user: {
        en: {
            user_name: "Username",
            anime_count: "anime count",
            manga_count: "manga count",
            minutes_watched: "minutes watched",
            chapters_read: "chapters read"
        },
        vi: {
            user_name: "Tên người dùng",
            anime_count: "Anime",
            anime_count_value: "bộ anime",
            manga_count: "Manga",
            manga_count_value: "bộ manga",
            minutes_watched: "Đã xem",
            minutes_watched_value: "phút đã xem",
            chapters_read: "Đã đọc",
            chapters_read_value: "chương đã đọc"
            
        }
    },

    help: {
        en: {
            command_title: "Command list",
            embed_description: "List of available commands:"
        },
        vi: {
            command_title: "Danh sách các lệnh",
            embed_description: "Dưới đây là danh sách lệnh có sẵn: "
        }
    },

    changelog: {
        en: {
            no_release: "No release found.",
            no_changelog: "No changelog found.",
            changelog_title: "Latest Changelog",
            changelog_description: "Here are the latest changes and updates:"
        },
        vi: {
            no_release: "Không tìm thấy bản phát hành.",
            no_changelog: "Không tìm thấy nhật ký thay đổi.",
            changelog_title: "Nhật Ký Thay Đổi Mới Nhất",
            changelog_description: "Dưới đây là những thay đổi và cập nhật mới nhất:"
        }
    },

    weather: {
        en: {
            location: "Location name",
            longitude: "Longitude",
            latitude: "Latitude",
            degreetype: "Degree type",
            current_temperature: "Current temperature",
            feels_like: "Feels like",
            winddisplay: "Wind",
            humidity: "Humidity",
            observationtime: "Update time"
        },
        vi: {
            location: "Tên địa điểm",
            longitude: "Kinh độ",
            latitude: "Vĩ độ",
            degreetype: "Đơn vị nhiệt độ",
            current_temperature: "Nhiệt độ đo được",
            feels_like: "Nhiệt độ cảm nhận",
            winddisplay: "Tốc độ gió",
            humidity: "Độ ẩm",
            observationtime: "Cập nhật lúc"
        }
    },

    avatar: {
        en: {
            user_name: "User",
            requested_by: "Requested by"
        },
        vi: {
            user_name: "Người dùng",
            requested_by: "Được yêu cầu bởi"
        }
    },

    stats: {
        en: {
            title: "Bot Statistics",
            ping: "Ping",
            uptime: "Uptime",
            version: "Version",
            cpu: "CPU",
            ram: "RAM",
            disk_usage: "Disk Usage",
            os: "Operating System",
            node: "Node.js Version",
            library: "Library"
        },
        vi: {
            title: "Thống Kê",
            ping: "Ping",
            uptime: "Thời Gian Hoạt Động",
            version: "Phiên Bản",
            cpu: "CPU",
            ram: "RAM",
            disk_usage: "Dung Lượng Đĩa",
            os: "Hệ Điều Hành",
            node: "Phiên Bản Node.js",
            library: "Thư Viện"
        }
    },

    // remove if you dont have a donate command - immizsx
    donate: {
        en: {
            title: "Sponsor Project",
            description: "If you’d like to support us, your donation will help keep the bot running and improve its features.",
            footer: "Thank you for your consideration! <3"
        },
        vi: {
            title: "Ủng Hộ Dự án",
            description: "Nếu bạn muốn ủng hộ chúng tôi, sự đóng góp của bạn sẽ giúp duy trì và cải thiện các tính năng của bot.",
            footer: "Cảm ơn bạn đã xem xét! <3"
        }
    },
    module: {
        en: {
            command_description: "Manage bot modules.",
            module_list_title: "Module List",
            module_list_description: "List of all available modules and their statuses.",
            module_id: "Module ID",
            module_name: "Module Name",
            module_status: "Status",
            enabled: "Enabled",
            disabled: "Disabled",
            toggle_success: "Module status updated successfully.",
            toggle_fail: "Failed to update module status. Please try again.",
            permission_denied: "You need 'Manage Server' permission to use this command.",
            invalid_module: "Invalid module ID. Please choose a valid module."
        },
        vi: {
            command_description: "Quản lý các module của bot.",
            module_list_title: "Danh Sách Module",
            module_list_description: "Danh sách tất cả các module có sẵn và trạng thái của chúng.",
            module_id: "ID Module",
            module_name: "Tên Module",
            module_status: "Trạng Thái",
            enabled: "Đã Bật",
            disabled: "Đã Tắt",
            toggle_success: "Cập nhật trạng thái module thành công.",
            toggle_fail: "Cập nhật trạng thái module thất bại. Vui lòng thử lại.",
            permission_denied: "Bạn cần quyền 'Quản lý máy chủ' để sử dụng lệnh này.",
            invalid_module: "ID module không hợp lệ. Vui lòng chọn một module hợp lệ."
        }
    },
    hyperlink: {
        en: {
            name: "Fake Hyperlink Detector",
            description: "Detect fake link and send alert for suspicious hyperlinks.",
            embed_Title: "Fake Hyperlink Detected",
            embed_description: "A potentially malicious hyperlink has been detected and removed.",
            embed_field_sender: "Sender",
            embed_field_time: "Time",
            embed_field_channel: "Channel",
            embed_field_displaylink: "Displayed Link",
            embed_field_actuallink: "Actual Link",
            embed_field_messagecontent: "Message Content",
            embed_footer: "Message ID: "

        },
        vi: {
            name: "Trình Phát Hiện Liên Kết Giả",
            description: "Phát hiện liên kết giả và gửi cảnh báo cho các liên kết nghi ngờ.",
            embed_Title: "Liên Kết Giả Đã Bị Phát Hiện",
            embed_description: "Một liên kết có thể độc hại đã bị phát hiện và bị xóa.",
            embed_field_sender: "Người Gửi",
            embed_field_time: "Thời Gian",
            embed_field_channel: "Kênh",
            embed_field_displaylink: "Liên Kết Được Hiển Thị",
            embed_field_actuallink: "Liên Kết Thực",
            embed_field_messagecontent: "Nội Dung Tin Nhắn",
            embed_footer: "ID Tin Nhắn: "
        }
    }
};

/**
 * Get localized message based on interaction locale
 * @param {string} section - Message section
 * @param {string} key - Message key
 * @param {string} locale - Discord locale ('en-US', 'vi')
 * @returns {string} Localized message
 */
function getLocalizedMessage(section, key, locale = 'en-US') {
    // Convert locale
    const lang = locale.startsWith('vi') ? 'vi' : 'en';
    
    if (responseMessages[section] && responseMessages[section][lang] && responseMessages[section][lang][key]) {
        return responseMessages[section][lang][key];
    }
    
    // Fallback to English
    if (responseMessages[section] && responseMessages[section]['en'] && responseMessages[section]['en'][key]) {
        return responseMessages[section]['en'][key];
    }
    
    return key; // Return key if no translation found
}

/**
 * Get command localization data for slash command registration
 * @param {string} commandName - Name of the command
 * @returns {Object} Command localization data
 */
function getCommandLocalization(commandName) {
    return commandLocalizations[commandName] || {
        name: commandName,
        description: `Command: ${commandName}`,
        nameLocalizations: {},
        descriptionLocalizations: {}
    };
}

module.exports = {
    commandLocalizations,
    responseMessages,
    getLocalizedMessage,
    getCommandLocalization
};
