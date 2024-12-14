package com.nuhcorre.chupebankbackend.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";

    public static SecretKeySpec generateKey(String secretKeyHex) {
        byte[] decodedKey = hexToBytes(secretKeyHex);
        return new SecretKeySpec(decodedKey, ALGORITHM);
    }

    public static IvParameterSpec generateIv(String initVectorHex) {
        byte[] iv = hexToBytes(initVectorHex);
        return new IvParameterSpec(iv);
    }

    public static String encrypt(String plainText, SecretKeySpec key, IvParameterSpec iv) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static String decrypt(String encryptedText, SecretKeySpec key, IvParameterSpec iv) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
        return new String(decryptedBytes);
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i+1), 16));
        }
        return data;
    }

    public static void main(String[] args) throws Exception {
        // Chave e IV hexadecimais
        String secretKeyHex = "ab2b51b572fdb87fb3d02bcab558cb18"; // 32 bytes
        String ivHex = "a2f95da07f43fae5a1b2c3d4e5f67890"; // 16 bytes

        SecretKeySpec key = generateKey(secretKeyHex);
        IvParameterSpec iv = generateIv(ivHex);

        String plainText = "{\"email\":\"adm@adm.com\",\"senha\":\"adm\"}";
        String encrypted = encrypt(plainText, key, iv);
        System.out.println("Encrypted: " + encrypted);

        String decrypted = decrypt(encrypted, key, iv);
        System.out.println("Decrypted: " + decrypted);
    }
}
