package com.nuhcorre.chupebankbackend.enums;

import java.util.Arrays;
import java.util.List;

public enum FiltroPalavras {

    PALAVRAS_PROIBIDAS(new String[] {
            "bosta",
            "merda",
            "cu",
            "caralho",
            "foda",
            "foda-se",
            "fodase",
            "fds",
            "fdp",
            "filho da puta",
            "puta",
            "putinha",
            "crl",
            "crlh",
            "corno",
            "vagabundo",
            "vagabunda",
            "vadia",
            "vadio",
            "otario",
    });

    private final List<String> palavras;

    FiltroPalavras(String[] palavras) {
        this.palavras = Arrays.asList(palavras);
    }

    public List<String> getPalavras() {
        return palavras;
    }

    public boolean contains(String palavra) {
        return palavras.contains(palavra);
    }
}