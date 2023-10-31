export function success(d, c = 200) {
  const event = useEvent();
  setResponseStatus(event, c);
  return {
    code: c,
    status: "success",
    data: d,
  };
}

export function fail(m, c = 500) {
  const event = useEvent();
  setResponseStatus(event, c);
  return {
    code: c,
    status: "fail",
    msg: m,
  };
}
