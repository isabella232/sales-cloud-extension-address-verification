const axios = require('axios');
const { get } = require('lodash');

const { salesCloud } = require('../constants/constants');
const logger = require("../logger/console")("AccountsAPIClient")
const getResultsFromODataResponse = oDataResponse => get(oDataResponse, 'd.results', []);

class AccountsAPIClient {

  findAccountByObjectID(accountObjectID) {
    logger.info(`Fetching account ${accountObjectID} from Sales Cloud `);

    return axios({
      url: `${salesCloud.accountsBaseURL}/CorporateAccountCollection('${accountObjectID}')`,
      method: 'get',
      params: {
        '$format': 'json',
        '$select': 'CurrentDefaultAddressUUID,Name,CountryCodeText,HouseNumber,Street,StreetPostalCode,City'
      }
    }).then(resp => {
      return getResultsFromODataResponse(resp.data)
    });
  }

  patchAccountAddressByObjectID(addressId, data) {
    return axios({
      url: `${salesCloud.accountsBaseURL}/CorporateAccountAddressCollection('${addressId}')`,
      method: 'patch',
      data: data,
    }).then(addressResponse => {
      return getResultsFromODataResponse(addressResponse.data)
    });
  }

}
module.exports = {
  factory: () => new AccountsAPIClient(),
};
