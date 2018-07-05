const uri = 'http://api.stackexchange.com/2.0/questions'

export const questions = `${uri}?site=stackoverflow`;

export const question = (id) => `${uri}/${id}?site=stackoverflow&filter=withbody`;
