const errorMessages = new Map([
    ['auth/user-not-found', 'Usuário nao encontrado.'],
    ['validation/email', 'Email inválido.'],
    ['auth/wrong-password', 'Senha inválida.']
]);
export function mapErrorMessage(errorCode)
{
    if(errorMessages.get(errorCode) == undefined)
    {
        return errorCode;
    }
    else return errorMessages.get(errorCode);
}