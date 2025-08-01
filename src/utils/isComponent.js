import { coordinates } from "../../coordinates"

export default function isComponent(componentName) {
    let foundComponent = coordinates.find(c => c.componentName === componentName)

    if (foundComponent) {
        return true
    }
    return false
}