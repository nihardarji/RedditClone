import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {

    // Record or a Map of key value pair of type string
    const errorMap: Record<string, string> = {}
    errors.forEach(({ field, message }) => {
        errorMap[field] = message
    })
    return errorMap
}