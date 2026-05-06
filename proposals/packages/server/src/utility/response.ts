const asJson = <T extends number, Q>(status: T, payload: Q) => {
  return Response.json(
    { statusCode: status, body: { ...payload } },
    { status },
  );
};

export { asJson };
