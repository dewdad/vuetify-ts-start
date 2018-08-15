// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app login url', () => {
    cy.visit('/login')
    cy.get(':nth-child(1) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type('290621352@qq.com')

    cy.get(':nth-child(2) > .v-input__control > .v-input__slot > .v-text-field__slot > input')
      .type('123456')

    cy.get('.v-btn').click()
  })
})
