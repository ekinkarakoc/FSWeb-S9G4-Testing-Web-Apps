import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

beforeEach(() => {
  render(<IletisimFormu />);
});
test("hata olmadan render ediliyor", () => {});

test("iletişim formu headerı render ediliyor", () => {
  // !! ARRANGE//
  //   render(<IletisimFormu />);
  // !! ACT//
  //   const heading = screen.getByText(/İletişim Formu/i);
  const heading = screen.getByRole("heading", { level: 1 });
  // !! ASSERT//
  expect(heading).toBeInTheDocument();
  expect(heading).toBeTruthy();
  expect(heading).toHaveTextContent("İletişim Formu");
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciName, "test");
  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const buttonSubmit = screen.getByRole("button");
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const buttonSubmit = screen.getByRole("button");

  userEvent.type(kullaniciName, "reacttest");
  userEvent.type(soyad, "soyad");
  userEvent.click(buttonSubmit);

  const errorMsg = await screen.findAllByTestId("error");
  expect(errorMsg).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByLabelText(/email*/i);

  userEvent.type(email, "mail");

  await waitFor(() => {
    const errMsg = screen.getByTestId("error");
    expect(errMsg).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const button = screen.getByRole("button");
  userEvent.click(button);

  const errorMsg = await screen.findByText("Hata: soyad gereklidir.");

  expect(errorMsg).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const email = screen.getByLabelText(/email*/i);
  const button = screen.getByRole("button");

  userEvent.type(kullaniciName, "testreact");
  userEvent.type(soyad, "testreact2");
  userEvent.type(email, "test@test.com");

  button.click(button);

  await waitFor(() => {
    const nameInput = screen.getByTestId("firstnameDisplay");
    const surNameInput = screen.getByTestId("lastnameDisplay");
    const emailInput = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.queryByTestId("messageDisplay");
    const errMsg = screen.queryAllByTestId("error");

    expect(nameInput).toBeInTheDocument();
    expect(surNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();
    expect(errMsg).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const email = screen.getByLabelText(/email*/i);
  const button = screen.getByRole("button");
  const msg = screen.getByLabelText(/mesaj/i);

  userEvent.type(kullaniciName, "testreact");
  userEvent.type(soyad, "testreact2");
  userEvent.type(email, "test@test.com");
  userEvent.type(msg, "yazdım gitti...");

  button.click(button);

  await waitFor(() => {
    const msg = screen.queryByTestId(/yazdım gitti.../i);

    expect(msg).toBeInTheDocument;
  });
});
