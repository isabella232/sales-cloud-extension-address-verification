const logger = require("./../logger/console")("AccountsManager")
const { googleAPIKey } = require('../constants/constants')
const {Client, Status} = require("@googlemaps/google-maps-services-js");
const client = new Client();

class AccountsManager {
  constructor(accountsAPIClient) {
    this.accountsAPIClient = accountsAPIClient;
  }

  updateAccount(accountID) {
      return this.accountsAPIClient
          .findAccountByObjectID(accountID).then((corporateAccount) => {
              logger.info("Sales Cloud Account has been found")

              // call Google maps
              const address = this.lookupForAddressFromAccount(corporateAccount)
              logger.info("Sales Cloud Account has address")

              return this.completeAddress(address).then((googleMapData) => {
                  logger.info("Google Map API successfully called")

                  const addressId = corporateAccount.CurrentDefaultAddressUUID.replace(/-/g, "");
                  googleMapData.ObjectID = addressId;
                  return this.accountsAPIClient.patchAccountAddressByObjectID(addressId, googleMapData)
                      .then(result => {
                          logger.info("SalesCloud Account Address has been updated successfully; ", googleMapData)
                          return result
                      })
              });
        });
  }

  lookupForAddressFromAccount(corporateAccount) {
    let address = "";
    for (let key in corporateAccount) {
        if (key !== '__metadata' && key !== 'CurrentDefaultAddressUUID' && key !== 'Name') // filter metadata
        {
            if ((typeof corporateAccount[key] !== "function") && (typeof corporateAccount[key] !== "undefined")) {
                address += " " + corporateAccount[key];
            }
        }
    }

    return address;
  }

  completeAddress(address) {
      return client.geocode({
          params: {
              key: googleAPIKey,
              address: address.trim(),
          },
          timeout: 20000
      }).then((resp) => {
          if (resp.data.status !== Status.OK) {
              return Promise.reject(`could not geocode address, result ${resp.data.status} received`)
          }

          const response = {}
          // get address
          resp.data.results[0].address_components.forEach(element => {
              if (this.isElement(element, "route")) {
                  response.Street = element.long_name;
              } else if (this.isElement(element, "street_number")) {
                  response.HouseNumber = element.long_name;
              } else if (this.isElement(element, "locality")) {
                  response.City =  element.long_name;
              } else if (this.isElement(element, "postal_code")) {
                  response.StreetPostalCode =  element.long_name;
              } else if (this.isElement(element, "country")) {
                  response.CountryCode =  element.short_name;
              }
          });

          // get geolocation
          response.Latitude = resp.data.results[0].geometry.location.lat.toString();
          response.Longitude = resp.data.results[0].geometry.location.lng.toString();
          return Promise.resolve(response)
      })
  }

  isElement(element, targetQualifier) {
      return (element.types.indexOf(targetQualifier) > -1)
  }
}
module.exports = {
  factory(accountsAPIClient) {
    return new AccountsManager(accountsAPIClient);
  },
};
