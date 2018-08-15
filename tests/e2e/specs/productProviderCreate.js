// https://docs.cypress.io/api/introduction/api.html

var faker = require('faker')
faker.locale = 'zh_CN'

describe('添加产品供应商', () => {
  it('访问产品供应商页面', () => {
    cy.visit('/product-providers')

    cy.get('.layout > .v-btn').click()

    cy.url().should('include', '/product-providers')

    cy.contains('创建供应商')

    cy.get(':nth-child(2) > :nth-child(1) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.company.companyName())

    cy.get(':nth-child(2) > :nth-child(2) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.random.uuid())

    cy.get(':nth-child(2) > .v-textarea > .v-input__control > .v-input__slot > .v-text-field__slot > textarea')
      .type(faker.lorem.paragraph(1))

    cy.get(':nth-child(4) > :nth-child(1) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.internet.email(faker.lorem.word()))

    cy.get(':nth-child(4) > :nth-child(2) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.random.number({min: 10000, max: 99999999999}))

    cy.get(':nth-child(4) > :nth-child(3) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.finance.account())

    cy.get(':nth-child(1) > .v-input__control > .v-input__slot > .v-menu > .v-menu__activator > .v-select__slot > .v-select__selections')
      .click()

    const paymentSelect = [
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(1) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(2) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(3) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(4) > .v-list__tile > .v-list__tile__content > .v-list__tile__title'
    ]

    const index = faker.random.number({min: 0, max: 3})
    const el = paymentSelect[index]
    cy.get(el).click()

    cy.get(':nth-child(6) > .v-textarea > .v-input__control > .v-input__slot > .v-text-field__slot > textarea')
      .type(faker.lorem.paragraph(1))

    cy.get(':nth-child(3) > .v-input__control > .v-input__slot > .v-menu > .v-menu__activator > .v-select__slot > .v-select__selections')
      .click()

    const balanceSelect = [
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(1) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(2) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(3) > .v-list__tile > .v-list__tile__content > .v-list__tile__title',
      '.menuable__content__active > .v-select-list > .v-list > :nth-child(4) > .v-list__tile > .v-list__tile__content > .v-list__tile__title'
    ]

    cy.get(balanceSelect[faker.random.number({min: 0, max: 3})]).click()

    cy.get(':nth-child(6) > :nth-child(4) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.internet.exampleEmail())

    cy.get(':nth-child(8) > :nth-child(1) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.name.firstName() + faker.name.lastName())

    cy.get(':nth-child(8) > :nth-child(2) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.phone.phoneNumber())

    cy.get(':nth-child(8) > :nth-child(3) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.phone.phoneNumber())

    cy.get(':nth-child(8) > :nth-child(4) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.phone.phoneNumber())

    cy.get(':nth-child(8) > :nth-child(5) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.address.zipCode())

    cy.get(':nth-child(8) > :nth-child(6) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.address.country())

    cy.get(':nth-child(8) > :nth-child(7) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.address.state())

    cy.get(':nth-child(8) > :nth-child(8) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.address.city())

    cy.get(':nth-child(8) > :nth-child(9) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type(faker.address.streetAddress())

    cy.get(':nth-child(8) > .v-textarea > .v-input__control > .v-input__slot > .v-text-field__slot > textarea')
      .type(faker.address.secondaryAddress())

    cy.get('.primary > .v-btn__content').click()
  })
})
