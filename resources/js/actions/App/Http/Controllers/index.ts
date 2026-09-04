import UserController from './UserController'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers