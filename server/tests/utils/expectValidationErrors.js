function expectValidationErrors(response, expectedMessages) {
  expect(response.statusCode).toBe(422);
  expect(response.body.message).toBe('Validation failed');
  expect(Array.isArray(response.body.errors)).toBe(true);
  expect(response.body.errors).toEqual(
    expect.arrayContaining(
      expectedMessages.map(msg => expect.objectContaining({ message: msg }))
    )
  );
}

module.exports = { expectValidationErrors }